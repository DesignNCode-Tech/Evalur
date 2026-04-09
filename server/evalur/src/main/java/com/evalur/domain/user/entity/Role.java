package com.evalur.domain.user.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Defines the user access levels.
 * Spring Security expects the "ROLE_" prefix for hasRole() checks.
 */
@Getter
@RequiredArgsConstructor
public enum Role {
    ADMIN("ROLE_ADMIN"),
    INSTITUTE_ADMIN("ROLE_INSTITUTE_ADMIN"),
    STAFF("ROLE_STAFF"),
    STUDENT("ROLE_STUDENT");

    private final String authority;
}