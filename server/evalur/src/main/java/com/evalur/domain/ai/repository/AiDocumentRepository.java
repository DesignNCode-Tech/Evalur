package com.evalur.domain.ai.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.evalur.domain.ai.entity.AiDocument;

@Repository
public interface AiDocumentRepository extends JpaRepository<AiDocument, Long> {
    List<AiDocument> findByOrganizationIdOrderByCreatedAtDesc(Long organizationId);
}