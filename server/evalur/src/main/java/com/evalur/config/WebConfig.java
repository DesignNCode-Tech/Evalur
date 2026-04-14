package com.evalur.config;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.method.HandlerTypePredicate;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${evalur.client.url}") 
    private String clientUrl;


    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Allow CORS requests from the frontend (running on localhost:5173)
        registry.addMapping("/**") 
                .allowedOrigins(clientUrl)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        // Automatically prepends "/api/v1" to all controllers annotated with @RestController
        configurer.addPathPrefix(
            "/api/v1", 
            HandlerTypePredicate.forAnnotation(RestController.class)
        );
    }

   
}