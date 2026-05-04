package com.evalur.domain.assessment.dto;

import java.util.List;

public record AssessmentAssignmentRequest(
    Long assessmentId,
    List<Long> candidateIds
) {}