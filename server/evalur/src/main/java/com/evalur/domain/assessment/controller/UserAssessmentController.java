package com.evalur.domain.assessment.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.evalur.common.ApiResponse;
import com.evalur.domain.assessment.dto.AssessmentAssignmentRequest;
import com.evalur.domain.assessment.dto.CandidateAssessmentResponse;
import com.evalur.domain.assessment.dto.UserSubmissionDTO;
import com.evalur.domain.assessment.entity.UserAssessment;
import com.evalur.domain.assessment.repository.UserAssessmentRepository;
import com.evalur.domain.assessment.service.EvaluationService;
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
        // 1. Run existing status update logic
        userAssessmentService.submitAssessment(dto);

        // 2. Fetch the session for the evaluation pipeline
        UserAssessment ua = userAssessmentRepository.findById(dto.getUserAssessmentId())
                .orElseThrow(() -> new RuntimeException("Assessment session not found"));

        // 3. Run Sidecar scoring (Phase 1)
        evaluationService.runEvaluationPipeline(ua, dto);

        // Standardized return using your ApiResponse.success helper
        return ResponseEntity.ok(ApiResponse.success(null, "Assessment evaluated successfully"));
    }
}