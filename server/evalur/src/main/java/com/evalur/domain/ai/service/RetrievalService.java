package com.evalur.domain.ai.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingMatch;
import dev.langchain4j.store.embedding.EmbeddingSearchRequest;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.filter.Filter;
import static dev.langchain4j.store.embedding.filter.MetadataFilterBuilder.metadataKey;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RetrievalService {

    private final EmbeddingModel embeddingModel;
    private final EmbeddingStore<TextSegment> embeddingStore;

    public String getRelevantContext(String query, Long orgId, List<String> documentIds) {
        // 1. Vectorize the manager's prompt (role, skills, etc.)
        var queryEmbedding = embeddingModel.embed(query).content();

        // 2. Build the Multi-tenant + Multi-doc Filter
        // This ensures Company A never sees Company B's data, 
        // and we only look at the documents the manager checked.
        Filter filter = metadataKey("orgId").isEqualTo(orgId)
                .and(metadataKey("documentId").isIn(documentIds));

        EmbeddingSearchRequest searchRequest = EmbeddingSearchRequest.builder()
                .queryEmbedding(queryEmbedding)
                .filter(filter)
                .maxResults(10) // Top 10 chunks for the LLM
                .build();

        // 3. Execute Search
        List<EmbeddingMatch<TextSegment>> matches = embeddingStore.search(searchRequest).matches();

        // 4. Flatten the text chunks into a single context string for Gemini
        return matches.stream()
                .map(match -> match.embedded().text())
                .collect(Collectors.joining("\n---\n"));
    }
}