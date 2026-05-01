package com.evalur.domain.ai.controller;

import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.evalur.domain.ai.service.AiDocumentService;
import com.evalur.security.utils.SecurityUtils;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/ai/docs")
@RequiredArgsConstructor
public class AiDocumentController {

    private final AiDocumentService aiDocumentService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadDocument(@RequestParam("file") MultipartFile file) {
        // Extract orgId from your existing JWT security utility
        Long orgId = SecurityUtils.getCurrentOrgId(); 
        UUID documentId = UUID.randomUUID();

        // Initiate the background pipeline
        aiDocumentService.initiateIngestionPipeline(file, orgId, documentId);

        return ResponseEntity.accepted().body(Map.of(
            "documentId", documentId,
            "status", "PROCESSING",
            "message", "Document received. Ingestion running in background."
        ));
    }
}