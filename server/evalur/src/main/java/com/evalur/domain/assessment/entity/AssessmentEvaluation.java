package com.evalur.domain.assessment.entity;

import com.evalur.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "assessment_evaluations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssessmentEvaluation extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_assessment_id", nullable = false, unique = true)
    private UserAssessment userAssessment;

    @Column(name = "objective_score", precision = 5, scale = 2)
    private BigDecimal objectiveScore; // Hard-coded truth

    @Column(name = "ai_logic_feedback", columnDefinition = "TEXT")
    private String aiLogicFeedback; // AI reasoning from Phase 3

    @Enumerated(EnumType.STRING)
    @Column(name = "evaluation_status")
    private EvaluationStatus evaluationStatus = EvaluationStatus.PENDING;

    @Column(name = "logic_dna", columnDefinition = "TEXT")
    private String logicDna; 

    
}