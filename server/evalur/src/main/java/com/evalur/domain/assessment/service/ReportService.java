package com.evalur.domain.assessment.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.evalur.domain.assessment.entity.AssessmentEvaluation;
import com.evalur.domain.assessment.repository.AssessmentEvaluationRepository;
import com.fasterxml.jackson.databind.ObjectMapper; // Import for parsing DNA

// iText 7 Imports
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
    private final ObjectMapper objectMapper; // Use the bean we configured earlier

    public byte[] generateAssessmentPdf(Long evaluationId) throws IOException {
        AssessmentEvaluation eval = evaluationRepository.findById(evaluationId)
                .orElseThrow(() -> new RuntimeException("Evaluation not found"));

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // 1. Header & Candidate Info
        document.add(new Paragraph("Evalur Technical Assessment Report")
                .setBold()
                .setFontSize(22));
        
        // Attempt to get user name from the relationship
        String candidateName = eval.getUserAssessment().getUser() != null ? 
                               eval.getUserAssessment().getUser().getName() : "Candidate ID: " + eval.getUserAssessment().getUserId();
        
        document.add(new Paragraph("Candidate: " + candidateName));
        document.add(new Paragraph("Assessment: " + eval.getUserAssessment().getAssessment().getTitle()));
        document.add(new Paragraph("Objective Score: " + eval.getObjectiveScore() + "%")
                .setFontSize(16)
                .setBold());
        
        document.add(new LineSeparator(new SolidLine()));

        // 2. Logic DNA Section (The Missing Part)
        if (eval.getLogicDna() != null && !eval.getLogicDna().isEmpty()) {
            document.add(new Paragraph("\nLOGIC DNA TRAJECTORY").setBold().setFontSize(14));
            try {
                // Parse the JSON string {"Efficiency":8, "Security":6...} into a Map
                Map<String, Integer> metrics = objectMapper.readValue(eval.getLogicDna(), Map.class);
                
                metrics.forEach((trait, score) -> {
                    document.add(new Paragraph(trait + ": " + score + " / 10"));
                });
            } catch (Exception e) {
                document.add(new Paragraph("Note: Logic metrics format is being processed."));
            }
        }

        // 3. AI Feedback Section
        document.add(new Paragraph("\nAI LOGIC CONSULTANT FEEDBACK").setBold().setFontSize(14));
        document.add(new Paragraph(eval.getAiLogicFeedback() != null ? 
                eval.getAiLogicFeedback() : "Analysis in progress..."));

        document.close();
        return out.toByteArray();
    }
}