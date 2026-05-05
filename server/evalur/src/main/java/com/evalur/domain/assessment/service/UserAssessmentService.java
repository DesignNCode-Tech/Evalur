package com.evalur.domain.assessment.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.evalur.domain.assessment.dto.AssessmentAssignmentRequest;
import com.evalur.domain.assessment.dto.CandidateAssessmentResponse;
import com.evalur.domain.assessment.dto.UserSubmissionDTO;
import com.evalur.domain.assessment.entity.Assessment;
import com.evalur.domain.assessment.entity.UserAssessment;
import com.evalur.domain.assessment.repository.AssessmentRepository;
import com.evalur.domain.assessment.repository.UserAssessmentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserAssessmentService {

    private final UserAssessmentRepository userAssessmentRepository;
    private final AssessmentRepository assessmentRepository;

    @Transactional
    public void assignToCandidates(AssessmentAssignmentRequest request) {
        Assessment assessment = assessmentRepository.findById(request.assessmentId())
                .orElseThrow(() -> new RuntimeException("Assessment not found"));

        List<UserAssessment> assignments = request.candidateIds().stream()
                .filter(uid -> !userAssessmentRepository.existsByUserIdAndAssessmentId(uid, request.assessmentId()))
                .map(uid -> UserAssessment.builder()
                .userId(uid)
                .assessment(assessment)
                .status(UserAssessment.AssignmentStatus.ASSIGNED)
                .assignedAt(LocalDateTime.now())
                .build())
                .toList();

        userAssessmentRepository.saveAll(assignments);
    }

    public List<CandidateAssessmentResponse> getCandidateDashboard(Long userId) {
        return userAssessmentRepository.findByUserIdOrderByAssignedAtDesc(userId)
                .stream()
                .map(ua -> new CandidateAssessmentResponse(
                ua.getId(),
                ua.getAssessment().getId(),
                ua.getAssessment().getTitle(),
                ua.getAssessment().getRole(),
                ua.getAssessment().getSeniority(),
                ua.getStatus(),
                ua.getAssignedAt()))
                .toList();
    }

    @Transactional
    public String startAssessment(Long assignmentId, Long userId) {
        UserAssessment ua = userAssessmentRepository.findById(assignmentId)
                .filter(a -> a.getUserId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        if (ua.getStatus() == UserAssessment.AssignmentStatus.ASSIGNED) {
            ua.setStatus(UserAssessment.AssignmentStatus.IN_PROGRESS);
            ua.setStartedAt(LocalDateTime.now());
            userAssessmentRepository.save(ua);
        }

        // Return the actual JSON content for the candidate to see the questions
        return ua.getAssessment().getContent();
    }

   @Transactional
    public void submitAssessment(UserSubmissionDTO dto) {
        UserAssessment ua = userAssessmentRepository.findById(dto.getUserAssessmentId())
                .orElseThrow(() -> new RuntimeException("Assessment session not found"));

        // Use 'setStatus' to match your existing field name 'status'
        // Access the inner enum via UserAssessment.AssignmentStatus
        ua.setStatus(UserAssessment.AssignmentStatus.SUBMITTED);
        ua.setCompletedAt(LocalDateTime.now());

        userAssessmentRepository.save(ua);
    }
    

    
}

