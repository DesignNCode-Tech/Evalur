package com.evalur.domain.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Used by Managers to invite others via the InvitationController.
 */
public record InviteRequest(
    //Enable for future use
    // @NotBlank(message = "Recipient email is required")
    // @Email(message = "Invalid email format")
    // String email,

    @NotBlank(message = "Role assignment is required")
    String role ,

    @NotBlank(message = "Seniority level is required")
    String seniorityLevel
) {}