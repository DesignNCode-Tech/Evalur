package com.evalur.security.utils;

import org.springframework.security.core.context.SecurityContextHolder;

import com.evalur.domain.user.entity.User;

/// Utility class to access security context information, such as the current user's organization ID.
public class SecurityUtils {

    public static Long getCurrentOrgId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        if (principal instanceof User user) {
            // We access the ID through the organization object.
            // Because the filter just loaded this user, the proxy is usually 
            // available, but it's safest to check for null.
            return (user.getOrganization() != null) ? user.getOrganization().getId() : null;
        }
        return null;
    }

    public static User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}