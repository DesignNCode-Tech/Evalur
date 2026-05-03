package com.evalur.domain.assessment.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.evalur.common.ApiResponse;
import com.evalur.domain.assessment.dto.AssessmentRequest;
import com.evalur.domain.assessment.entity.Assessment;
import com.evalur.domain.assessment.repository.AssessmentRepository;
import com.evalur.domain.assessment.service.AssessmentService;
import com.evalur.security.utils.SecurityUtils;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/assessments")
@RequiredArgsConstructor
public class AssessmentController {

    private final AssessmentService assessmentService;
    private final AssessmentRepository assessmentRepository;

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createAssessment(@RequestBody AssessmentRequest request) {
        var currentUser = SecurityUtils.getCurrentUser();

        // Initialize the Assessment record
        Assessment assessment = Assessment.builder()
                .title(request.title())
                .role(request.role())
                .seniority(request.seniority())
                .organization(currentUser.getOrganization())
                .status(Assessment.AssessmentStatus.GENERATING)
                .content("{}")
                .build();

        assessment = assessmentRepository.save(assessment);

        // Trigger async generation in the background
        assessmentService.runGenerationPipeline(assessment.getId(), request.documentIds(), request.jobDescription());

        return ResponseEntity.accepted().body(ApiResponse.success(
                Map.of("id", assessment.getId(), "status", "GENERATING"),
                "Assessment generation started."
        ));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Assessment>>> getMyAssessments() {
        Long orgId = SecurityUtils.getCurrentOrgId(); // Filter by the current manager's organization
        return ResponseEntity.ok(ApiResponse.success(
                assessmentRepository.findByOrganizationIdOrderByCreatedAtDesc(orgId),
                "Assessments retrieved."
        ));
    }
}
