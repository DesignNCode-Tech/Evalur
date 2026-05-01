package com.evalur.domain.ai.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AiDocumentService {

    @Value("${evalur.ai.llamaparse.api-key}")
    private String llamaApiKey;

    @Value("${evalur.ai.llamaparse.base-url}")
    private String url ;
    private final RestTemplate restTemplate = new RestTemplate();

    public String processAndExtract(MultipartFile file, Long orgId) {

       

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.setBearerAuth(llamaApiKey);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", file.getResource());

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, requestEntity, Map.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                // Return the Job ID for tracking/polling
                return response.getBody().get("id").toString();
            }
            throw new RuntimeException("LlamaParse upload failed with status: " + response.getStatusCode());
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload to LlamaParse: " + e.getMessage());
        }
    }
    // Method to poll for results using the Job ID
    public String getParsedResult(String jobId) {
    String url = "https://api.cloud.llamaindex.ai/api/v1/parsing/job/" + jobId + "/result/markdown";

    HttpHeaders headers = new HttpHeaders();
    headers.setBearerAuth(llamaApiKey);
    HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

    try {
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, requestEntity, Map.class);
        
        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            // LlamaParse returns the markdown text in the 'markdown' field
            return (String) response.getBody().get("markdown");
        }
        return "Processing... (Check back in a few seconds)";
    } catch (Exception e) {
        return "Error retrieving result: " + e.getMessage();
    }
}
}