package com.evalur.domain.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(
    @NotBlank(message = "Name cannot be blank")
    String name,

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Invalid email format")
    String email,

    @NotBlank(message = "Password cannot be blank")
    String password,

    @NotBlank(message = "Seniority level is required")
    String seniorityLevel,

    // Used for Path A (Admin/Boss)
    String organizationName,

    // Used for Path B (Manager/Candidate)
    String inviteToken
) {}