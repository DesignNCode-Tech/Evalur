package com.evalur.domain.ai.service;

import java.time.Duration;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import lombok.extern.slf4j.Slf4j;
import reactor.util.retry.Retry;

@Service
@Slf4j
public class AiGenerationService {

    @Value("${evalur.ai.google-gemini.api-key}")
    private String apiKey;

    private final WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
    private static final String MODEL = "models/gemini-2.5-flash";

    public AiGenerationService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl(BASE_URL).build();
    }

    /**
     * Generates a structured JSON assessment with RAG context and regeneration awareness.
     */
    public String generateAssessmentJson(
            String role,
            String seniority,
            String context,
            String jobDescription,
            int regenerationCount
    ) {

        // Deterministic for first attempt (0.2), more creative for regenerations (0.4)
        double temperature = (regenerationCount == 0) ? 0.2 : 0.4;

        String prompt = constructPrompt(role, seniority, context, jobDescription, regenerationCount);

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of(
                                "role", "user",
                                "parts", List.of(Map.of("text", prompt))
                        )
                ),
                "generationConfig", Map.of(
                        "temperature", temperature,
                        "responseMimeType", "application/json"
                )
        );

        log.info("Calling Gemini model: {} | temp={} | regen={}", MODEL, temperature, regenerationCount);

        try {
            String response = webClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/" + MODEL + ":generateContent")
                            .queryParam("key", apiKey)
                            .build()
                    )
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(30))
                    .retryWhen(Retry.backoff(2, Duration.ofSeconds(2)))
                    .block();

            String extracted = extractText(response);
            String cleanJson = sanitizeJson(extracted);

            JsonNode root = objectMapper.readTree(cleanJson);

            // Apply normalization (truncating extras) and strict validation
            root = normalize(root);
            validateJson(root);

            return objectMapper.writeValueAsString(root);

        } catch (Exception e) {
            log.error("Gemini generation failed: {}", e.getMessage(), e);
            throw new RuntimeException("Gemini generation failed", e);
        }
    }

    private String extractText(String response) {
        try {
            JsonNode root = objectMapper.readTree(response);

            JsonNode candidates = root.path("candidates");
            if (!candidates.isArray() || candidates.isEmpty()) {
                throw new RuntimeException("No candidates in response");
            }

            JsonNode parts = candidates.get(0)
                    .path("content")
                    .path("parts");

            if (!parts.isArray() || parts.isEmpty()) {
                throw new RuntimeException("No parts in response");
            }

            String text = parts.get(0).path("text").asText();

            if (text == null || text.isBlank()) {
                throw new RuntimeException("Empty Gemini response text");
            }

            return text.trim();

        } catch (Exception e) {
            log.error("Extraction failed: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to extract Gemini response", e);
        }
    }

    private String sanitizeJson(String raw) {
        if (raw == null || raw.isBlank()) {
            throw new RuntimeException("Empty response from Gemini");
        }

        String trimmed = raw.trim();

        // Strip markdown code blocks (```json ... ```) if present
        if (trimmed.startsWith("```")) {
            int firstNewline = trimmed.indexOf("\n");
            int lastBackticks = trimmed.lastIndexOf("```");

            if (firstNewline > 0 && lastBackticks > firstNewline) {
                return trimmed.substring(firstNewline, lastBackticks).trim();
            }
        }

        return trimmed;
    }

    /**
     * Normalizes the output to ensure exact quantities without failing the request.
     */
    private JsonNode normalize(JsonNode root) {
        if (!(root instanceof ObjectNode objectNode)) return root;

        // Ensure exactly 3 MCQs
        if (objectNode.has("mcqs") && objectNode.get("mcqs").isArray()) {
            ArrayNode mcqs = (ArrayNode) objectNode.get("mcqs");
            while (mcqs.size() > 3) {
                mcqs.remove(3); 
            }
        }

        // Ensure exactly 1 Coding Task
        if (objectNode.has("codingTasks") && objectNode.get("codingTasks").isArray()) {
            ArrayNode coding = (ArrayNode) objectNode.get("codingTasks");
            while (coding.size() > 1) {
                coding.remove(1);
            }
        }

        return objectNode;
    }

    private void validateJson(JsonNode root) {
        if (!root.has("mcqs") || !root.get("mcqs").isArray() || root.get("mcqs").isEmpty()) {
            throw new RuntimeException("Missing or empty mcqs array");
        }

        if (!root.has("codingTasks") || !root.get("codingTasks").isArray() || root.get("codingTasks").isEmpty()) {
            throw new RuntimeException("Missing or empty codingTasks array");
        }

        if (root.get("mcqs").size() != 3) {
            throw new RuntimeException("Validation failed: Expected exactly 3 MCQs");
        }

        root.get("mcqs").forEach(mcq -> {
            if (!mcq.has("question") || !mcq.has("options") || 
                !mcq.has("correctOptionIndex") || !mcq.has("explanation")) {
                throw new RuntimeException("Invalid MCQ structure detected");
            }

            if (mcq.get("options").size() != 4) {
                throw new RuntimeException("MCQ must have exactly 4 options");
            }

            int idx = mcq.get("correctOptionIndex").asInt(-1);
            if (idx < 0 || idx > 3) {
                throw new RuntimeException("correctOptionIndex must be an integer between 0 and 3");
            }
        });

        if (root.get("codingTasks").size() != 1) {
            throw new RuntimeException("Validation failed: Expected exactly 1 coding task");
        }
    }

    private String constructPrompt(
            String role,
            String seniority,
            String context,
            String jobDescription,
            int regenerationCount
    ) {

        String variationHint = (regenerationCount > 0)
                ? "\nIMPORTANT: This is a regeneration request. Provide a DIFFERENT set of questions to ensure variety.\n"
                : "";

        return String.format("""
                You are an expert technical recruiter. Generate a high-quality technical assessment.

                ROLE: %s
                SENIORITY: %s

                JOB DESCRIPTION:
                %s

                TECHNICAL CONTEXT:
                %s

                %s

                TASK:
                Generate exactly 3 MCQs and 1 Coding Task.

                STRICT REQUIREMENTS:
                - Return ONLY valid JSON.
                - Each MCQ must have exactly 4 options.
                - correctOptionIndex must be 0-3.
                - No conversational text or markdown wrappers.

                SCHEMA:
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
                """, role, seniority, 
                (jobDescription != null ? jobDescription : "N/A"), 
                (context != null ? context : "N/A"),
                variationHint);
    }
}