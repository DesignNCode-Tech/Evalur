package com.evalur.domain.user.entity;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.evalur.common.BaseEntity;
import com.evalur.domain.organization.entity.Organization; // Shifted from Institute

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User extends BaseEntity implements UserDetails {

    @Column(nullable = false)
    private String name; 

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_role", nullable = false)
    private Role role;

    // NEW FIELD: Required for targeting Assessment difficulty via LLM
    @Column(name = "seniority_level")
    private String seniorityLevel; 

    // THE PIVOT: Bounded to an Organization instead of an Institute
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = true) 
    private Organization organization;

    // --- Helper Methods for the B2B Multi-Tenant RBAC ---
    
    public boolean isPlatformAdmin() {
        return this.role == Role.ADMIN && this.organization == null;
    }

    public boolean isCorporateAdmin() {
        return this.role == Role.ADMIN && this.organization != null;
    }

  
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Returns the ROLE string for SecurityConfig and JWT parsing checks
        return List.of(new SimpleGrantedAuthority(role.getAuthority()));
    }

    @Override
    public String getUsername() {
        return email; // Using email as the primary authentication identifier
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
}