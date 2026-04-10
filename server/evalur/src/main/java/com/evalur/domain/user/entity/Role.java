package com.evalur.domain.user.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Defines the user access levels for the Evalur B2B platform.
 * Spring Security expects the "ROLE_" prefix for hasRole() checks.
 */
@Getter
@RequiredArgsConstructor
public enum Role {
    
    // Platform Admin (Evalur staff) or Corporate Admin (Client CTO)
    ADMIN("ROLE_ADMIN"),
    
    // Engineering Manager (Uploads docs, creates assessment blueprints, invites candidates)
    MANAGER("ROLE_MANAGER"),
    
    // Interviewee (Takes the 3-layer assessment via magic link in the split-screen UI)
    CANDIDATE("ROLE_CANDIDATE");

    private final String authority;
}