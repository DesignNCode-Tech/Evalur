package com.evalur.domain.organization.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.evalur.domain.organization.dto.MemberResponse;
import com.evalur.domain.organization.dto.CandidateAssessmentDto;
import com.evalur.domain.organization.dto.AssessmentBriefDto;
import com.evalur.domain.user.repository.UserRepository;
import com.evalur.domain.assessment.repository.UserAssessmentRepository;
import com.evalur.domain.assessment.entity.UserAssessment;
import com.evalur.security.utils.SecurityUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final UserRepository userRepository;
    private final UserAssessmentRepository userAssessmentRepository;

    public List<MemberResponse> getOrganizationMembers() {
        Long orgId = SecurityUtils.getCurrentOrgId();

        return userRepository.findByOrganizationId(orgId).stream()
                .map(user -> {
                    List<UserAssessment> assessments = userAssessmentRepository.findByUserId(user.getId());

                    List<CandidateAssessmentDto> assessmentDtos = assessments.stream().map(ua -> {

                        // 1. Setup default evaluation values
                        String evalStatus = "PENDING";
                        Double objScore = null;
                        String logicDna = null;
                        String aiFeedback = null;

                        // 2. Override if evaluation exists
                        if (ua.getEvaluation() != null) {
                            evalStatus = ua.getEvaluation().getEvaluationStatus().name();
                            logicDna = ua.getEvaluation().getLogicDna();
                            aiFeedback = ua.getEvaluation().getAiLogicFeedback();

                            // FIX: Safely convert the BigDecimal to a Double
                            if (ua.getEvaluation().getObjectiveScore() != null) {
                                objScore = ua.getEvaluation().getObjectiveScore().doubleValue();
                            }
                        }

                        // 3. Create the Brief Record
                        AssessmentBriefDto brief = new AssessmentBriefDto(
                                ua.getAssessment().getId(),
                                ua.getAssessment().getTitle());

                        // 4. Return the fully constructed Assessment Record
                        return new CandidateAssessmentDto(
                                ua.getId(),
                                ua.getStatus().name(),
                                evalStatus,
                                objScore,
                                logicDna,
                                aiFeedback,
                                ua.getAssignedAt(),
                                ua.getStartedAt(),
                                ua.getCompletedAt(),
                                brief);
                    }).collect(Collectors.toList());

                    // 5. Return the parent Member Record
                    return new MemberResponse(
                            user.getId(),
                            user.getName(),
                            user.getEmail(),
                            user.getRole(),
                            user.getSeniorityLevel(),
                            assessmentDtos);
                })
                .collect(Collectors.toList());
    }
}