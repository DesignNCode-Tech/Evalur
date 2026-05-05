package com.evalur.domain.assessment.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.evalur.domain.assessment.entity.AssessmentEvaluation;

@Repository
public interface AssessmentEvaluationRepository extends JpaRepository<AssessmentEvaluation, Long> {
    
    /**
     * Finds the sidecar evaluation linked to a specific user assessment session.
     * This is critical for Phase 3 when the AI needs to update the existing
     * objective score record with logic feedback.
     */
    Optional<AssessmentEvaluation> findByUserAssessmentId(Long userAssessmentId);
}