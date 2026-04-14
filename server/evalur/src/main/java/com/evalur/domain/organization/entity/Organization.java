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

    //  Added unique = true to enforce the "Zomato" rule at the DB level
    @Column(nullable = false, unique = true)
    private String name;

    //  Removed nullable = false so initial registration doesn't crash
    @Column(unique = true)
    private String domain; 

    @Column(name = "subscription_tier")
    @Builder.Default // Added default so new orgs have a baseline tier
    private String subscriptionTier = "FREE"; 

    @Column(nullable = false)
    @Builder.Default // Added default so DB insertion doesn't fail
    private int apiQuotaLimit = 100; 

    @JsonIgnore //  CRITICAL: Prevents Jackson from infinitely serializing Org -> User -> Org
    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<User> users = new ArrayList<>();
}