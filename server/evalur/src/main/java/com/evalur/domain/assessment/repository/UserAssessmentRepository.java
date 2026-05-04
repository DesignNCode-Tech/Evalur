package com.evalur.domain.assessment.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.evalur.domain.assessment.entity.UserAssessment;

public interface UserAssessmentRepository extends JpaRepository<UserAssessment, Long> {
    // Find all tests assigned to a specific candidate
    List<UserAssessment> findByUserIdOrderByAssignedAtDesc(Long userId);
    
    // Optional: Check if already assigned
    boolean existsByUserIdAndAssessmentId(Long userId, Long assessmentId);
}