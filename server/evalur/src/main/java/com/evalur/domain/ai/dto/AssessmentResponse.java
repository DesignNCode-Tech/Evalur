package com.evalur.domain.ai.dto;

import java.util.List;

public record AssessmentResponse(
    List<McqQuestion> mcqs,
    List<CodingTask> codingTasks
) {}

record McqQuestion(
    String question,
    List<String> options,
    int correctOptionIndex,
    String explanation
) {}

record CodingTask(
    String title,
    String description,
    String constraints,
    String initialCode,
    String solutionTemplate
) {}