package com.evalur.domain.ai.service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.evalur.domain.ai.entity.AiDocument;
import com.evalur.domain.ai.repository.AiDocumentRepository;

import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.splitter.DocumentSplitters;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingStore;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiDocumentService {

    @Value("${evalur.ai.llamaparse.api-key}")
    private String llamaApiKey;

    @Value("${evalur.ai.llamaparse.base-url}") 
    private String llamaBaseUrl;

    private final AiDocumentRepository aiDocumentRepository;
    private final EmbeddingModel embeddingModel;
    private final EmbeddingStore<TextSegment> embeddingStore;
    private final RestTemplate restTemplate = new RestTemplate();

    @Async("taskExecutor")
    public void initiateIngestionPipeline(MultipartFile file, AiDocument aiDoc) {
        try {
            // STEP 1: PARSING[cite: 1]
            updateStatus(aiDoc, AiDocument.IngestionStatus.PARSING);
            String jobId = uploadToLlamaParse(file);
            aiDoc.setLlamaJobId(jobId);
            aiDocumentRepository.save(aiDoc);
            
            String markdown = pollForResults(jobId);

            if (markdown != null) {
                // STEP 2: VECTORIZING[cite: 1]
                updateStatus(aiDoc, AiDocument.IngestionStatus.VECTORIZING);
                processAndStore(markdown, aiDoc);
                
                // STEP 3: COMPLETED[cite: 1]
                updateStatus(aiDoc, AiDocument.IngestionStatus.COMPLETED);
            } else {
                throw new RuntimeException("LlamaParse timeout.");
            }
        } catch (Exception e) {
            log.error("Pipeline failed: {}", e.getMessage());
            aiDoc.setStatus(AiDocument.IngestionStatus.FAILED);
            aiDoc.setErrorMessage(e.getMessage());
            aiDocumentRepository.save(aiDoc);
        }
    }

    private String uploadToLlamaParse(MultipartFile file) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.setBearerAuth(llamaApiKey);
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", file.getResource());
        String url = llamaBaseUrl + "/parsing/upload"; 
        ResponseEntity<Map> response = restTemplate.postForEntity(url, new HttpEntity<>(body, headers), Map.class);
        return response.getBody().get("id").toString();
    }

    private String pollForResults(String jobId) throws InterruptedException {
        String pollUrl = llamaBaseUrl + "/parsing/job/" + jobId + "/result/markdown";
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(llamaApiKey);
        for (int i = 0; i < 30; i++) {
            TimeUnit.SECONDS.sleep(10);
            try {
                ResponseEntity<Map> resp = restTemplate.exchange(pollUrl, HttpMethod.GET, new HttpEntity<>(headers), Map.class);
                if (resp.getStatusCode().is2xxSuccessful() && resp.getBody() != null) {
                    return (String) resp.getBody().get("markdown");
                }
            } catch (Exception e) { log.debug("Polling..."); }
        }
        return null;
    }

   private void processAndStore(String markdown, AiDocument aiDoc) {
    Document document = Document.from(markdown);
    // 1. Generate all segments from the 100-page doc
    List<TextSegment> allSegments = DocumentSplitters.recursive(1000, 100).split(document);

    log.info("Total segments generated: {}. Starting batched vectorization...", allSegments.size());

    // 2. Define batch size (e.g., 20 chunks per API call)
    int batchSize = 20; 
    
    for (int i = 0; i < allSegments.size(); i += batchSize) {
        // Calculate the end of the current batch
        int end = Math.min(i + batchSize, allSegments.size());
        List<TextSegment> batch = allSegments.subList(i, end);

        try {
            // 3. Embed and persisted this specific batch to Neon
            embeddingStore.addAll(embeddingModel.embedAll(batch).content(), batch);
            
            log.info("Successfully vectorized batch: {} to {} of {}", i, end, allSegments.size());

            // 4. "Slow & Steady" - Pause for 2 seconds to stay under the 100 requests/min quota
            if (end < allSegments.size()) {
                TimeUnit.SECONDS.sleep(2); 
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Vectorization interrupted during batching", e);
        } catch (Exception e) {
            log.error("Failed to process batch starting at index {}: {}", i, e.getMessage());
            throw e; // This will trigger the FAILED status in the calling method
        }
    }
}
    private void updateStatus(AiDocument doc, AiDocument.IngestionStatus status) {
        doc.setStatus(status);
        aiDocumentRepository.save(doc);
    }
}