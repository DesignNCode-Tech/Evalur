package com.evalur.domain.assessment.controller;

import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.evalur.common.ApiResponse;
import com.evalur.domain.assessment.dto.AssessmentAssignmentRequest;
import com.evalur.domain.assessment.dto.CandidateAssessmentResponse;
import com.evalur.domain.assessment.dto.UserSubmissionDTO;
import com.evalur.domain.assessment.entity.AssessmentEvaluation;
import com.evalur.domain.assessment.entity.UserAssessment;
import com.evalur.domain.assessment.repository.AssessmentEvaluationRepository;
import com.evalur.domain.assessment.repository.UserAssessmentRepository;
import com.evalur.domain.assessment.service.EvaluationService;
import com.evalur.domain.assessment.service.ReportService;
import com.evalur.domain.assessment.service.UserAssessmentService;
import com.evalur.security.utils.SecurityUtils;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/user-assessments")
@RequiredArgsConstructor
public class UserAssessmentController {

    // 1. All fields at the top for proper initialization
    private final UserAssessmentService userAssessmentService;
    private final EvaluationService evaluationService;
    private final UserAssessmentRepository userAssessmentRepository;
    private final AssessmentEvaluationRepository evaluationRepository;
    private final ReportService reportService;

    @PostMapping("/assign")
    public ResponseEntity<ApiResponse<Void>> assign(
            @RequestBody AssessmentAssignmentRequest request) {
        userAssessmentService.assignToCandidates(request);
        return ResponseEntity.ok(ApiResponse.success(null, "Assessment assigned successfully."));
    }

    @GetMapping("/my-tasks")
    public ResponseEntity<ApiResponse<List<CandidateAssessmentResponse>>> getMyTasks() {
        return ResponseEntity.ok(ApiResponse.success(
                userAssessmentService.getCandidateDashboard(SecurityUtils.getCurrentUser().getId()),
                "Tasks retrieved."
        ));
    }

    @GetMapping("/{assignmentId}/start")
    public ResponseEntity<ApiResponse<String>> startTest(@PathVariable Long assignmentId) {
        String content = userAssessmentService.startAssessment(
                assignmentId,
                SecurityUtils.getCurrentUser().getId()
        );
        return ResponseEntity.ok(ApiResponse.success(content, "Test started."));
    }

 @PostMapping("/submit")
    public ResponseEntity<ApiResponse<Void>> submit(@RequestBody UserSubmissionDTO dto) {
        // 1. Mark status as SUBMITTED
        userAssessmentService.submitAssessment(dto);

        // 2. Fetch the session
        UserAssessment ua = userAssessmentRepository.findById(dto.getUserAssessmentId())
                .orElseThrow(() -> new RuntimeException("Assessment session not found"));

        // 3. Run Pipeline (Scoring -> RAG -> AI Logic DNA)
        evaluationService.runEvaluationPipeline(ua, dto);

        // REMOVED: The redundant call that was causing your 500 error
        return ResponseEntity.ok(ApiResponse.success(null, "Assessment evaluated successfully"));
    }

    // --- NEW: Result Endpoint for Radar Chart/Logic DNA ---
    @GetMapping("/{assignmentId}/result")
    public ResponseEntity<ApiResponse<AssessmentEvaluation>> getResult(@PathVariable Long assignmentId) {
        AssessmentEvaluation eval = evaluationRepository.findByUserAssessmentId(assignmentId)
                .orElseThrow(() -> new RuntimeException("Evaluation not found"));
        return ResponseEntity.ok(ApiResponse.success(eval, "Result retrieved."));
    }

    // --- NEW: PDF Download Endpoint ---
    @GetMapping("/evaluation/{evaluationId}/report")
    public ResponseEntity<byte[]> downloadReport(@PathVariable Long evaluationId) throws Exception {
        byte[] pdfContent = reportService.generateAssessmentPdf(evaluationId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=assessment_report_" + evaluationId + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfContent);
    }
}
