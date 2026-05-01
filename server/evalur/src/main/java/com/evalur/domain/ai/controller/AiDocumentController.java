package com.evalur.domain.ai.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.evalur.domain.ai.service.AiDocumentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/ai/docs")
@RequiredArgsConstructor
public class AiDocumentController {

    private final AiDocumentService aiDocumentService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadDocument(@RequestParam("file") MultipartFile file) {
        // Extracting orgId from the SecurityContext (populated by your JWT/Bearer filter)
        // Adjust the cast below to match your specific Principal/UserDetails class
        Long orgId = (Long) SecurityContextHolder.getContext().getAuthentication().getCredentials(); 
        
        // If your filter puts the ID in the Principal object, use:
        // Long orgId = ((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getOrgId();

        String jobId = aiDocumentService.processAndExtract(file, orgId);
        return ResponseEntity.ok("Ingestion started. Job ID: " + jobId);
    }

    @GetMapping("/status/{jobId}")
     public ResponseEntity<String> getStatus(@PathVariable String jobId) {
    String result = aiDocumentService.getParsedResult(jobId);
    return ResponseEntity.ok(result);
    }
}