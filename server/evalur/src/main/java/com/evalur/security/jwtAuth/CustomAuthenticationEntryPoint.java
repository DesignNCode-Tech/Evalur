package com.evalur.security.jwtAuth;

import java.io.IOException;
import java.time.LocalDateTime;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, 
                         AuthenticationException authException) throws IOException, ServletException {
        
        // 1. Set the response headers
        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        // 2. Write the JSON body matching your Task 1 ApiResponse format
        // We use a raw string here to avoid circular dependency issues with ObjectMappers
        String jsonResponse = String.format(
            "{ \"success\": false, \"message\": \"Unauthorized: %s\", \"data\": null, \"timestamp\": \"%s\" }",
            authException.getMessage(),
            LocalDateTime.now()
        );

        response.getWriter().write(jsonResponse);
    }
}