package com.evalur.domain.ai.service;

import java.time.Duration;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.evalur.domain.ai.dto.AiReasoningContext;
import com.evalur.domain.assessment.repository.AssessmentEvaluationRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;
import reactor.util.retry.Retry;

@Service
@Slf4j
public class AiReasoningService {

    private final String apiKey;
    private final String model;
    private final WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final AssessmentEvaluationRepository evaluationRepository;

    public AiReasoningService(
            WebClient.Builder webClientBuilder,
            AssessmentEvaluationRepository evaluationRepository,
            @Value("${evalur.ai.google-gemini.api-key}") String apiKey,
            @Value("${evalur.ai.google-gemini.base.url}") String baseUrl,
            @Value("${evalur.ai.google-gemini.model}") String model
    ) {
        this.evaluationRepository = evaluationRepository;
        this.apiKey = apiKey;
        this.model = model;
        this.webClient = webClientBuilder.baseUrl(baseUrl).build();
    }

    /**
     * Performs an asynchronous logic analysis of the candidate's code.
     * This keeps the user experience snappy while the AI thinks in the background.
     */
    @Async("taskExecutor")
    public void generateReasoning(AiReasoningContext context) {
        log.info("Starting AI Logic Analysis for Evaluation ID: {}", context.getEvaluationId());

        String prompt = constructReasoningPrompt(context.getCandidateCode(), context.getSolutionRubric());

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(Map.of(
                        "role", "user",
                        "parts", List.of(Map.of("text", prompt))
                )),
                "generationConfig", Map.of(
                        "temperature", 0.1, // Low temperature for consistent technical review
                        "maxOutputTokens", 300 
                )
        );

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
                    .timeout(Duration.ofSeconds(45))
                    .retryWhen(Retry.backoff(2, Duration.ofSeconds(2)))
                    .block();

            String feedback = extractText(response);

            // Update the Sidecar Table (AssessmentEvaluation)
            evaluationRepository.findById(context.getEvaluationId()).ifPresent(eval -> {
                eval.setAiLogicFeedback(feedback);
                evaluationRepository.save(eval);
                log.info("AI Reasoning successfully saved for Evaluation: {}", context.getEvaluationId());
            });

        } catch (Exception e) {
            log.error("AI Reasoning failed for Evaluation {}: {}", context.getEvaluationId(), e.getMessage());
        }
    }

    private String extractText(String response) throws Exception {
        JsonNode root = objectMapper.readTree(response);
        return root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText().trim();
    }

    private String constructReasoningPrompt(String code, String rubric) {
        return String.format("""
            Act as a Senior Technical Lead. Analyze the candidate's logic in the provided code against the 'Organization Standards'.
            The code has already passed functional tests; focus ONLY on architectural logic, safety, and efficiency.

            ORGANIZATION STANDARDS (RAG CONTEXT):
            %s

            CANDIDATE CODE:
            %s

            GOAL:
            Provide a 'Logic Trajectory' feedback in exactly 2-3 concise sentences. 
            Explain how well they followed the standards or where their logic might fail in a production environment.
            Do NOT mention syntax or formatting.
            """, rubric, code);
    }
}