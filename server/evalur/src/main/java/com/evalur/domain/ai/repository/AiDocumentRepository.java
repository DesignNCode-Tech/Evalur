package com.evalur.domain.ai.repository;

import com.evalur.domain.ai.entity.AiDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface AiDocumentRepository extends JpaRepository<AiDocument, UUID> {
    // Fetches document library for a specific organization
    List<AiDocument> findByOrganizationIdOrderByCreatedAtDesc(Long organizationId);
}