package com.evalur.domain.assessment.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.evalur.domain.assessment.entity.AssessmentEvaluation;
import com.evalur.domain.assessment.repository.AssessmentEvaluationRepository;
import com.evalur.domain.user.repository.UserRepository; // Add this import
import com.evalur.domain.user.entity.User; // Add this import
import com.fasterxml.jackson.databind.ObjectMapper;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.LineSeparator;
import com.itextpdf.kernel.pdf.canvas.draw.SolidLine;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final AssessmentEvaluationRepository evaluationRepository;
    private final UserRepository userRepository; // 1. Inject the UserRepository
    private final ObjectMapper objectMapper;

    public byte[] generateAssessmentPdf(Long evaluationId) throws IOException {
        AssessmentEvaluation eval = evaluationRepository.findById(evaluationId)
                .orElseThrow(() -> new RuntimeException("Evaluation not found"));

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // 2. Fetch the User entity using the userId from UserAssessment
        User candidate = userRepository.findById(eval.getUserAssessment().getUserId())
                .orElse(null);
        String candidateName = (candidate != null) ? candidate.getName() : "Unknown Candidate";

        // Header
        document.add(new Paragraph("Evalur Technical Assessment Report").setBold().setFontSize(22));
        
        // Candidate Info
        document.add(new Paragraph("Candidate: " + candidateName));
        document.add(new Paragraph("Assessment: " + eval.getUserAssessment().getAssessment().getTitle()));
        document.add(new Paragraph("Objective Score: " + eval.getObjectiveScore() + "%").setBold());
        
        document.add(new LineSeparator(new SolidLine()));

        // Logic DNA Section
        if (eval.getLogicDna() != null) {
            document.add(new Paragraph("\nLOGIC DNA TRAJECTORY").setBold());
            try {
                Map<String, Integer> metrics = objectMapper.readValue(eval.getLogicDna(), Map.class);
                metrics.forEach((trait, score) -> {
                    document.add(new Paragraph(trait + ": " + score + " / 10"));
                });
            } catch (Exception e) {
                document.add(new Paragraph("DNA metrics data is currently being processed."));
            }
        }

        // AI Feedback Section
        document.add(new Paragraph("\nAI LOGIC CONSULTANT FEEDBACK").setBold());
        document.add(new Paragraph(eval.getAiLogicFeedback()));

        document.close();
        return out.toByteArray();
    }
}