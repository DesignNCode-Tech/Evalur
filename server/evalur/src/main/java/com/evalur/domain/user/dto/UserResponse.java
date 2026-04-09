package com.evalur.domain.user.dto;


import com.evalur.domain.user.entity.Role;

public record UserResponse(
    String name,
    String email,
    Role role,
    String instituteName
) {}