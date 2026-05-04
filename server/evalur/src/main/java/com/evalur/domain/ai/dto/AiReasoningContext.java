package com.evalur.domain.ai.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AiReasoningContext {
    private Long evaluationId;     // ID from the sidecar table
    private String candidateCode;   // The student's code
    private String solutionRubric; // Retrieved RAG chunks (The "Ground Truth")
}