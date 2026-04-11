package com.evalur.domain.user.dto;

import com.evalur.domain.user.entity.Role;

public record AuthResponse(
    String token,
    String email,
    Role role,
    String message
) {}