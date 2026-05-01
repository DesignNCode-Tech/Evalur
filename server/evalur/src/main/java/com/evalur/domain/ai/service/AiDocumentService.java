package com.evalur.domain.ai.service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
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

    // Use: https://api.cloud.llamaindex.ai/api/v1/parsing/upload
    @Value("${evalur.ai.llamaparse.base-url}")
    private String llamaUploadUrl;

    private final EmbeddingModel embeddingModel;
    private final EmbeddingStore<TextSegment> embeddingStore;
    private final RestTemplate restTemplate = new RestTemplate();

    @Async("taskExecutor")
    public void initiateIngestionPipeline(MultipartFile file, Long orgId, UUID documentId) {
        try {
            log.info("Starting background ingestion | Org: {} | Doc: {}", orgId, documentId);
            
            // 1. Direct upload to your tested endpoint
            String jobId = uploadToLlamaParse(file);
            
            // 2. Poll for the specific markdown result
            String markdown = pollForResults(jobId);

            if (markdown != null && !markdown.isBlank()) {
                processAndStore(markdown, orgId, documentId);
                log.info("Ingestion Success | Document: {} is now vectorized in Neon.", documentId);
            }
        } catch (Exception e) {
            log.error("Critical Ingestion Failure | Doc: {} | Error: {}", documentId, e.getMessage());
        }
    }

    private String uploadToLlamaParse(MultipartFile file) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.setBearerAuth(llamaApiKey);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", file.getResource());

        // Use the exact URL injected from your properties
        ResponseEntity<Map> response = restTemplate.postForEntity(llamaUploadUrl, new HttpEntity<>(body, headers), Map.class);
        
        if (response.getBody() == null || response.getBody().get("id") == null) {
            throw new RuntimeException("Failed to retrieve Job ID from LlamaParse upload.");
        }
        
        return response.getBody().get("id").toString();
    }

    private String pollForResults(String jobId) throws InterruptedException {
        // Construct the result URL based on the LlamaIndex API structure
        // Replacing '/upload' with '/job/{jobId}/result/markdown'
        String pollUrl = llamaUploadUrl.replace("/upload", "/job/" + jobId + "/result/markdown");

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(llamaApiKey);

        for (int i = 0; i < 15; i++) {
            TimeUnit.SECONDS.sleep(10);
            try {
                ResponseEntity<Map> resp = restTemplate.exchange(pollUrl, HttpMethod.GET, new HttpEntity<>(headers), Map.class);
                if (resp.getStatusCode().is2xxSuccessful() && resp.getBody() != null) {
                    return (String) resp.getBody().get("markdown");
                }
            } catch (Exception e) {
                log.debug("Polling Job {}: Processing still in progress...", jobId);
            }
        }
        return null;
    }

    private void processAndStore(String markdown, Long orgId, UUID documentId) {
        Document document = Document.from(markdown);
        
        // Split 1000 chars with 100 overlap (LangChain4j 0.35.0)
        List<TextSegment> segments = DocumentSplitters.recursive(1000, 100).split(document);

        // Multi-tenant hierarchical metadata tagging
        segments.forEach(segment -> {
            segment.metadata().add("orgId", orgId);
            segment.metadata().add("documentId", documentId.toString());
        });

        // Batch embed and persist to Neon DB
        embeddingStore.addAll(embeddingModel.embedAll(segments).content(), segments);
    }
}