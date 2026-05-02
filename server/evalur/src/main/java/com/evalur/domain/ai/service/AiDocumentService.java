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
        // Chunking the doc into 1000 character pieces[cite: 1]
        List<TextSegment> segments = DocumentSplitters.recursive(1000, 100).split(document);

        // Tagging each chunk with the Organization and Document ID[cite: 1]
        segments.forEach(segment -> {
            segment.metadata().add("orgId", aiDoc.getOrganization().getId());
            segment.metadata().add("documentId", aiDoc.getId().toString());
        });

        // Embedding (Vectorizing) and saving to Neon[cite: 1]
        embeddingStore.addAll(embeddingModel.embedAll(segments).content(), segments);
    }

    private void updateStatus(AiDocument doc, AiDocument.IngestionStatus status) {
        doc.setStatus(status);
        aiDocumentRepository.save(doc);
    }
}