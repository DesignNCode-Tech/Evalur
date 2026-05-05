package com.evalur.domain.organization.dto;

import java.time.LocalDateTime;

public record CandidateAssessmentDto(
    Long id,
    String status,
    String evaluationStatus,
    Double objectiveScore,
    String logicDna,
    String aiLogicFeedback,
    LocalDateTime assignedAt,
    LocalDateTime startedAt,
    LocalDateTime completedAt,
    AssessmentBriefDto assessment
) {}