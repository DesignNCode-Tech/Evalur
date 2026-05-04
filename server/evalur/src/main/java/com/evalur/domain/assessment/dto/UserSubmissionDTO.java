package com.evalur.domain.assessment.dto;

import java.util.List;

import lombok.Data;

@Data
public class UserSubmissionDTO {
    private Long userAssessmentId;
    private List<Integer> mcqAnswers; // Indices matching the assessment content order
    private String codingSolution;    // The actual code written by the student
}