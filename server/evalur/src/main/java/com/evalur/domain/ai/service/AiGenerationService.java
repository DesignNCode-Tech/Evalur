package com.evalur.domain.ai.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AiGenerationService {

    @Value("${evalur.ai.google-gemini.api-key}")
    private String apiKey;

    private final WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

    public AiGenerationService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl(BASE_URL).build();
    }

    public String generateAssessmentJson(
            String role,
            String seniority,
            String context,
            String jobDescription
    ) {

        String prompt = constructPrompt(role, seniority, context, jobDescription);

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of(
                                "role", "user",
                                "parts", List.of(Map.of("text", prompt))
                        )
                ),
                "generationConfig", Map.of(
                        "temperature", 0.7,
                        "responseMimeType", "application/json"
                )
        );

        String model = "models/gemini-2.5-flash";

        log.info("Calling Gemini model: {}", model);

        try {
            String response = webClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/" + model + ":generateContent")
                            .queryParam("key", apiKey)
                            .build()
                    )
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            return extractText(response);

        } catch (Exception e) {
            log.error("Gemini generation failed: {}", e.getMessage(), e);
            throw new RuntimeException("Gemini generation failed", e);
        }
    }

    private String extractText(String response) {
        try {
            JsonNode root = objectMapper.readTree(response);

            return root.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText("");

        } catch (Exception e) {
            log.error("Failed to parse Gemini response: {}", e.getMessage());
            return "";
        }
    }

    private String constructPrompt(
            String role,
            String seniority,
            String context,
            String jobDescription
    ) {
        return String.format("""
                You are an expert technical recruiter.

                ROLE: %s
                SENIORITY: %s

                JOB DESCRIPTION:
                %s

                CONTEXT:
                %s

                TASK:
                Generate:
                - 3 MCQs
                - 1 Coding Task

                Return ONLY valid JSON:
                {
                  "mcqs": [
                    {
                      "question": "",
                      "options": ["", "", "", ""],
                      "correctOptionIndex": 0,
                      "explanation": ""
                    }
                  ],
                  "codingTasks": [
                    {
                      "title": "",
                      "description": "",
                      "constraints": "",
                      "initialCode": "",
                      "solutionTemplate": ""
                    }
                  ]
                }
                """,
                role,
                seniority,
                jobDescription != null ? jobDescription : "N/A",
                context != null ? context : "N/A"
        );
    }
}