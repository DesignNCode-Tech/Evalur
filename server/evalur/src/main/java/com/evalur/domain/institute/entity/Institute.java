package com.evalur.domain.institute.entity;

import com.evalur.common.BaseEntity;
import com.evalur.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "institutes")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Institute extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String domain; 

    private String subscriptionPlan; 

    @Column(nullable = false)
    private int apiQuotaLimit; 

    // many users (Admins, Staff, Students)
    @OneToMany(mappedBy = "institute", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<User> users = new ArrayList<>();
}