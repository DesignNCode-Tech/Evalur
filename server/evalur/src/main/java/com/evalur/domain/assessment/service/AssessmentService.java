package com.evalur.domain.assessment.service;

import java.util.List;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.evalur.domain.ai.service.AiGenerationService;
import com.evalur.domain.ai.service.RetrievalService;
import com.evalur.domain.assessment.entity.Assessment;
import com.evalur.domain.assessment.repository.AssessmentRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final RetrievalService retrievalService;
    private final AiGenerationService aiGenerationService;

    /**
     * Orchestrates the entire assessment generation pipeline: 1. Retrieves
     * relevant context from the provided document IDs. 2. Calls the AI
     * generation service to create the assessment JSON. 3. Saves the generated
     * content back to the database and updates status.
     */

    @Async("taskExecutor")
    public void runGenerationPipeline(Assessment assessment, List<String> documentIds, String jobDescription) {
        try {
            // 1. Get Context from PDFs (if any are selected)
            String pdfContext = "";
            if (documentIds != null && !documentIds.isEmpty()) {
                pdfContext = retrievalService.getRelevantContext(
                        assessment.getRole() + " " + assessment.getSeniority(),
                        assessment.getOrganization().getId(),
                        documentIds
                );
            }

            // 2. Generate JSON using BOTH sources
            String jsonContent = aiGenerationService.generateAssessmentJson(
                    assessment.getRole(),
                    assessment.getSeniority(),
                    pdfContext, // Knowledge from manuals
                    jobDescription // Specific needs from manager
            );

            assessment.setContent(jsonContent);
            assessment.setStatus(Assessment.AssessmentStatus.READY);
            assessmentRepository.save(assessment);

        } catch (Exception e) {
            log.error("Generation failed: {}", e.getMessage());
            assessment.setStatus(Assessment.AssessmentStatus.FAILED);
            assessmentRepository.save(assessment);
        }
    }

}
