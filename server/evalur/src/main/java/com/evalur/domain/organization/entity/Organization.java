package com.evalur.domain.organization.entity;

import java.util.ArrayList;
import java.util.List;

import com.evalur.common.BaseEntity;
import com.evalur.domain.user.entity.User;

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

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String domain; 

    @Column(name = "subscription_tier")
    private String subscriptionTier; 

    @Column(nullable = false)
    private int apiQuotaLimit; 

    // One Organization has many users (Corporate Admins, Managers, Candidates)
    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<User> users = new ArrayList<>();
}