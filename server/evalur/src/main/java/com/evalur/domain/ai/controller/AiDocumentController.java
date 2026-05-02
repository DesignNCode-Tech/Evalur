package com.evalur.domain.ai.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.evalur.common.ApiResponse;
import com.evalur.domain.ai.entity.AiDocument;
import com.evalur.domain.ai.repository.AiDocumentRepository;
import com.evalur.domain.ai.service.AiDocumentService;
import com.evalur.domain.user.entity.User;
import com.evalur.security.utils.SecurityUtils;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/ai/docs")
@RequiredArgsConstructor
public class AiDocumentController {

    private final AiDocumentService aiDocumentService;
    private final AiDocumentRepository aiDocumentRepository;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadDocument(@RequestParam("file") MultipartFile file) {
        User currentUser = SecurityUtils.getCurrentUser(); // Gets the logged-in manager
        
        // Save the doc as PENDING so it shows up in the dashboard immediately
        AiDocument aiDoc = AiDocument.builder()
                .filename(file.getOriginalFilename())
                .organization(currentUser.getOrganization())
                .status(AiDocument.IngestionStatus.PENDING)
                .build();
        
        aiDoc = aiDocumentRepository.save(aiDoc);

        // Start the background work
        aiDocumentService.initiateIngestionPipeline(file, aiDoc);

        return ResponseEntity.accepted().body(ApiResponse.success(
            Map.of("documentId", aiDoc.getId(), "status", "PENDING"),
            "Processing started."
        ));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AiDocument>>> getOrgDocuments() {
        Long orgId = SecurityUtils.getCurrentOrgId(); // Only show docs for THIS organization[cite: 1]
        List<AiDocument> docs = aiDocumentRepository.findByOrganizationIdOrderByCreatedAtDesc(orgId);
        return ResponseEntity.ok(ApiResponse.success(docs, "Library retrieved."));
    }
}