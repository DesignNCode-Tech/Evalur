package com.evalur.domain.ai.service;

import org.springframework.stereotype.Service;

import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiGenerationService {

    // Inject the pre-configured bean from AiConfig
    private final GoogleAiGeminiChatModel chatModel;
    private final RetrievalService retrievalService;

    /**
     * Generates a structured JSON assessment based on retrieved context.
     */
   public String generateAssessmentJson(String role, String seniority, String context, String jobDescription) {
    try{
    String prompt = String.format("""
        You are an expert technical recruiter. Generate a technical assessment for:
        ROLE: %s
        SENIORITY: %s
        
        MANAGER'S JOB DESCRIPTION (Prioritize these topics):
        %s
        
        TECHNICAL CONTEXT FROM MANUALS (Use this for accuracy):
        %s
        
        REQUIREMENTS:
        1. Generate 3 MCQs and 1 Coding Tasks.
        2. If a Job Description is provided, ensure questions focus on those specific skills.
        3. Use the Technical Manuals to ensure the questions are factually correct.
        4. Return ONLY raw JSON.
        
        SCHEMA:
        {
          "mcqs": [{"question": "", "options": ["", "", "", ""], "correctOptionIndex": 0, "explanation": ""}],
          "codingTasks": [{"title": "", "description": "", "constraints": "", "initialCode": "", "solutionTemplate": ""}]
        }
        """, role, seniority, 
        (jobDescription != null ? jobDescription : "N/A"), 
        (context != null ? context : "N/A"));


        log.info("Sending request to Gemini (Timeout set to 3 minutes)...");

    return chatModel.generate(prompt);

    } catch (RuntimeException e) {
        log.error("Gemini API Error Detail: {}", e.getCause() != null ? e.getCause().getMessage() : e.getMessage());
        throw e;
    }
}
}