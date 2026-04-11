package com.evalur.domain.user.dto;

import com.evalur.domain.user.entity.Role; // Import your Role enum

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RegisterRequest(
    @NotBlank(message = "Name cannot be blank")
    String name,

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Invalid email format")
    String email,

    @NotBlank(message = "Password cannot be blank")
    String password,

    @NotNull(message = "Organization ID is required")
    Long organizationId,

    @NotBlank(message = "Seniority level is required")
    String seniorityLevel,

    @NotNull(message = "Role is required")
    Role role 
) {}