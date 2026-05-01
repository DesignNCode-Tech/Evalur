package com.evalur.domain.ai.config;


// TextSegment is now here:
import org.springframework.beans.factory.annotation.Value; 
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.googleai.GoogleAiEmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.pgvector.PgVectorEmbeddingStore;

@Configuration
public class AiConfig {

    @Value("${evalur.ai.google-gemini.api-key}")
    private String geminiApiKey;

    @Value("${spring.db.url.raw}")
    private String dbHost;

    @Value("${spring.datasource.username}")
    private String dbUser;

    @Value("${spring.datasource.password}")
    private String dbPassword;

    @Bean
    public EmbeddingModel embeddingModel() {
        return GoogleAiEmbeddingModel.builder()
            .apiKey(geminiApiKey)
            .modelName("text-embedding-004")
            .build();
    }

    @Bean
    public EmbeddingStore<TextSegment> embeddingStore() {
        return PgVectorEmbeddingStore.builder()
            .host(dbHost)
            .port(5432)
            .database("neondb")
            .user(dbUser)
            .password(dbPassword)
            .table("ai_document_chunks")
            .dimension(768) // Matches Gemini's output
            .build();
    }
}