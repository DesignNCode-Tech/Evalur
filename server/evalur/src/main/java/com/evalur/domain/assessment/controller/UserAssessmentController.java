package com.evalur.domain.assessment.controller;

import java.util.List;

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
import com.evalur.domain.assessment.service.UserAssessmentService;
import com.evalur.security.utils.SecurityUtils;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/user-assessments")
@RequiredArgsConstructor
public class UserAssessmentController {

    private final UserAssessmentService userAssessmentService;

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
}
