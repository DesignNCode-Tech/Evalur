package com.evalur.domain.ai.dto;

import java.time.LocalDateTime;

public record AiDocumentResponse(
    Long id,
    String fileName,
    LocalDateTime createdAt
) {}