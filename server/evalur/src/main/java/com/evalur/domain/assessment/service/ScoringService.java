package com.evalur.domain.assessment.service;

import java.math.BigDecimal;
import java.math.RoundingMode;

import org.springframework.stereotype.Service;

import com.evalur.domain.assessment.dto.UserSubmissionDTO;
import com.evalur.domain.assessment.entity.Assessment;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ScoringService {

    private final ObjectMapper objectMapper;

    public BigDecimal calculateObjectiveScore(UserSubmissionDTO submission, Assessment assessment) {
        try {
            JsonNode root = objectMapper.readTree(assessment.getContent());
            JsonNode mcqs = root.path("mcqs");
            
            double mcqWeight = 60.0; // configurable
            double codeWeight = 40.0;

            // 1. MCQ Marker
            long correct = 0;
            for (int i = 0; i < mcqs.size(); i++) {
                int correctIdx = mcqs.get(i).path("correctOptionIndex").asInt();
                if (i < submission.getMcqAnswers().size() && 
                    submission.getMcqAnswers().get(i).equals(correctIdx)) {
                    correct++;
                }
            }
            double mcqFinal = mcqs.size() > 0 ? ((double) correct / mcqs.size()) * mcqWeight : 0.0;

            // 2. Functional Code Check (Deterministic)
            boolean hasCode = submission.getCodingSolution() != null && 
                             submission.getCodingSolution().trim().length() > 20;
            double codeFinal = hasCode ? codeWeight : 0.0;

            return BigDecimal.valueOf(mcqFinal + codeFinal).setScale(2, RoundingMode.HALF_UP);
        } catch (Exception e) {
            return BigDecimal.ZERO;
        }
    }
}