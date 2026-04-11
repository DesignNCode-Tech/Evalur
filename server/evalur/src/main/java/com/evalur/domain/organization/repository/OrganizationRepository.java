package com.evalur.domain.organization.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.evalur.domain.organization.entity.Organization;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
}