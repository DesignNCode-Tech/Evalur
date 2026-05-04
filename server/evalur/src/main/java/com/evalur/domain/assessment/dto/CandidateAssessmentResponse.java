package com.evalur.domain.assessment.dto;

import java.time.LocalDateTime;

import com.evalur.domain.assessment.entity.UserAssessment.AssignmentStatus;

public record CandidateAssessmentResponse(
    Long assignmentId,
    Long assessmentId,
    String title,
    String role,
    String seniority,
    AssignmentStatus status,
    LocalDateTime assignedAt
) {}