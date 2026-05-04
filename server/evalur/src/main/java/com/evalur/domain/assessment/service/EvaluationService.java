package com.evalur.domain.assessment.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.evalur.domain.ai.dto.AiReasoningContext;
import com.evalur.domain.ai.service.AiReasoningService;
import com.evalur.domain.ai.service.RetrievalService; // Injected Phase 3 service
import com.evalur.domain.assessment.dto.UserSubmissionDTO;
import com.evalur.domain.assessment.entity.AssessmentEvaluation;
import com.evalur.domain.assessment.entity.EvaluationStatus;
import com.evalur.domain.assessment.entity.UserAssessment;
import com.evalur.domain.assessment.repository.AssessmentEvaluationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EvaluationService {

    private final AssessmentEvaluationRepository evaluationRepository;
    private final ScoringService scoringService;
    private final RetrievalService retrievalService;
    private final AiReasoningService aiReasoningService; // Added for Logic Consultant

    @Transactional
    public void runEvaluationPipeline(UserAssessment ua, UserSubmissionDTO dto) {
        
        // --- Phase 1: Objective Scoring (Deterministic & Free) ---
        var score = scoringService.calculateObjectiveScore(dto, ua.getAssessment());

        // Save to the Sidecar table to ensure marks are persistent immediately
        AssessmentEvaluation evaluation = evaluationRepository.findByUserAssessmentId(ua.getId())
                .orElse(new AssessmentEvaluation());
        
        evaluation.setUserAssessment(ua);
        evaluation.setObjectiveScore(score);
        evaluation.setEvaluationStatus(EvaluationStatus.COMPLETED);
        
        // Save first so we have an ID for the async process
        final AssessmentEvaluation savedEval = evaluationRepository.save(evaluation);

        // --- Phase 2: Retrieval & Phase 3: AI Reasoning ---
        // Only run if the candidate actually submitted a solution for a coding task
        if (dto.getCodingSolution() != null && !dto.getCodingSolution().isBlank()) {
            
            // 1. Extract metadata from the assessment
            Long orgId = ua.getAssessment().getOrganization().getId();
            
            // 2. Map associated document IDs for the RAG filter
            List<String> documentIds = ua.getAssessment().getDocuments().stream()
                    .map(doc -> doc.getId().toString())
                    .collect(Collectors.toList());

            // 3. Fetch context from Neon/PGVector using the candidate's code as the query
            String rRubric = retrievalService.getRelevantContext(
                dto.getCodingSolution(), 
                orgId, 
                documentIds
            );

            // 4. Bundle context for the AI Consultant
            AiReasoningContext aiContext = AiReasoningContext.builder()
                .evaluationId(savedEval.getId())
                .candidateCode(dto.getCodingSolution())
                .solutionRubric(rRubric)
                .build();

            // 5. Trigger Async Logic Analysis (The "Logic Consultant" part)
            // This runs in the background while the user gets their "Success" response
            aiReasoningService.generateReasoning(aiContext);
        }
    }
}