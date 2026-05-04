package com.evalur.domain.assessment.entity;

import java.util.List;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.evalur.common.BaseEntity;
import com.evalur.domain.ai.entity.AiDocument;
import com.evalur.domain.organization.entity.Organization;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "assessments")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Assessment extends BaseEntity {

    @Column(nullable = false)
    private String title;

    private String role;
    private String seniority;

    @JdbcTypeCode(SqlTypes.JSON) 
    @Column(columnDefinition = "jsonb")
    private String content;


    @ManyToMany
private List<AiDocument> documents;

    

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @Enumerated(EnumType.STRING)
    private AssessmentStatus status;

    public enum AssessmentStatus {
        GENERATING, // Currently being processed by Gemini
        READY,      // Successfully generated and saved to Neon
        FAILED,     // Error during retrieval or generation
        ASSIGNED,   // Sent to a candidate
        COMPLETED   // Candidate has finished the test
    }
}