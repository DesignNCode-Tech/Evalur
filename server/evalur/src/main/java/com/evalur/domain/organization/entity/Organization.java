package com.evalur.domain.organization.entity;

import java.util.ArrayList;
import java.util.List;

import com.evalur.common.BaseEntity;
import com.evalur.domain.user.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnore; 

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "organizations")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Organization extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String name;

    @Column(unique = true)
    private String domain; 

    @Column(name = "subscription_tier")
    @Builder.Default 
    private String subscriptionTier = "FREE"; 

    @Column(nullable = false)
    @Builder.Default 
    private int apiQuotaLimit = 100; 

    // --- NEW IDENTITY FIELDS FOR ONBOARDING ---
    @Column
    private String industry;

    @Column
    private String website;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "contact_phone")
    private String contactPhone;

    @JsonIgnore 
    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<User> users = new ArrayList<>();
}