package com.evalur.domain.organization.dto;

import java.util.List;

import com.evalur.domain.user.entity.Role;

public record MemberResponse(
    Long id,
    String name,
    String email,
    Role role,
    String seniorityLevel,
    List<CandidateAssessmentDto> userAssessments 
) {}