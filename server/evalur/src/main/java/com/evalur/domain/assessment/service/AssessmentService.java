package com.evalur.domain.assessment.service;

import java.util.List;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Async("taskExecutor")
    public void runGenerationPipeline(Long assessmentId, List<String> documentIds, String jobDescription) {
        // 1. Fetch a "fresh" copy of the assessment inside this thread
        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new RuntimeException("Assessment not found for ID: " + assessmentId));

        try {
            log.info("Starting generation for Assessment ID: {}", assessmentId);

            // 2. Get Context from PDFs
            String pdfContext = "";
            if (documentIds != null && !documentIds.isEmpty()) {
                pdfContext = retrievalService.getRelevantContext(
                        assessment.getRole() + " " + assessment.getSeniority(),
                        assessment.getOrganization().getId(),
                        documentIds
                );
            }

            // 3. Generate JSON using BOTH sources
            String jsonContent = aiGenerationService.generateAssessmentJson(
                    assessment.getRole(),
                    assessment.getSeniority(),
                    pdfContext,
                    jobDescription
            );

            // 4. Log the length to verify we received the data shown in your chart
            log.info("Gemini returned {} characters of JSON content.", jsonContent.length());

            // 5. Update and Save
            assessment.setContent(jsonContent);
            assessment.setStatus(Assessment.AssessmentStatus.READY);
            assessmentRepository.save(assessment);
            
            log.info("Assessment {} successfully marked as READY.", assessmentId);

        } catch (Exception e) {
            // Enhanced logging with the full stack trace to catch parsing errors
            log.error("Generation failed for ID {}: {}", assessmentId, e.getMessage(), e);
            assessment.setStatus(Assessment.AssessmentStatus.FAILED);
            assessmentRepository.save(assessment);
        }
    }

    @Transactional
    public void saveResults(Long id, String content) {
        Assessment assessment = assessmentRepository.findById(id).get();
        assessment.setContent(content);
        assessment.setStatus(Assessment.AssessmentStatus.READY);
        assessmentRepository.save(assessment);
    }

    @Transactional
    public void updateStatusToFailed(Long id) {
        assessmentRepository.findById(id).ifPresent(a -> {
            a.setStatus(Assessment.AssessmentStatus.FAILED);
            assessmentRepository.save(a);
        });
    }
}