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
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserAssessmentService {

    private final UserAssessmentRepository userAssessmentRepository;
    private final AssessmentRepository assessmentRepository;
    
    private final ObjectMapper objectMapper;

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

        String rawContent = ua.getAssessment().getContent();
        
        if (rawContent == null || rawContent.trim().isEmpty()) {
            return "{}";
        }

        try {
            // 1. Parse the string into a JSON tree
            JsonNode rootNode = objectMapper.readTree(rawContent);

            // 2. Strip sensitive data from MCQs
            if (rootNode.has("mcqs") && rootNode.get("mcqs").isArray()) {
                ArrayNode mcqs = (ArrayNode) rootNode.get("mcqs");
                for (JsonNode mcq : mcqs) {
                    ObjectNode mcqObj = (ObjectNode) mcq;
                    mcqObj.remove("correctOptionIndex"); // Delete answer
                    mcqObj.remove("explanation");        // Delete explanation
                }
            }

            // 3. Strip sensitive data from Coding Tasks
            if (rootNode.has("codingTasks") && rootNode.get("codingTasks").isArray()) {
                ArrayNode codingTasks = (ArrayNode) rootNode.get("codingTasks");
                for (JsonNode task : codingTasks) {
                    ObjectNode taskObj = (ObjectNode) task;
                    taskObj.remove("solutionTemplate");  // Delete solution
                }
            }

            // 4. Return the safe, sanitized JSON string
            return objectMapper.writeValueAsString(rootNode);

        } catch (Exception e) {
            throw new RuntimeException("Error securing assessment content", e);
        }
    }

    @Transactional
    public void submitAssessment(UserSubmissionDTO dto) {
        UserAssessment ua = userAssessmentRepository.findById(dto.getUserAssessmentId())
                .orElseThrow(() -> new RuntimeException("Assessment session not found"));

        if (ua.getEvaluation() != null) {
            throw new RuntimeException("This assessment has already been evaluated.");
        }

        // Use 'setStatus' to match your existing field name 'status'
        // Access the inner enum via UserAssessment.AssignmentStatus
        ua.setStatus(UserAssessment.AssignmentStatus.SUBMITTED);
        ua.setCompletedAt(LocalDateTime.now());

        userAssessmentRepository.save(ua);
    }

}