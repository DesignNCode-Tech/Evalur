package com.evalur.domain.assessment.dto;

import java.util.List;

public record AssessmentRequest(
    String title, 
    String role, 
    String seniority, 
    List<String> documentIds,
    String jobDescription // optional
) {}