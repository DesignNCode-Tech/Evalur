package com.evalur.domain.assessment.dto;

import com.evalur.domain.assessment.entity.Assessment.AssessmentStatus;

public record AssessmentSummaryResponse(
    Long id,
    String title,
    String role,
    String seniority,
    AssessmentStatus status
) {}