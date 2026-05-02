package com.evalur.domain.ai.entity;

import com.evalur.common.BaseEntity;
import com.evalur.domain.organization.entity.Organization;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ai_documents")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiDocument extends BaseEntity {

    @Column(nullable = false)
    private String filename;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IngestionStatus status;

    @Column(name = "llama_job_id")
    private String llamaJobId;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    public enum IngestionStatus {
        PENDING, 
        PARSING, 
        VECTORIZING, 
        COMPLETED, 
        FAILED
    }
}