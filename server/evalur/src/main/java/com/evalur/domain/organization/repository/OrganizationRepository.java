package com.evalur.domain.organization.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.evalur.domain.organization.entity.Organization;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {

    // Custom query method to check if an organization with the given name already exists
    boolean existsByName(String name);

    

 // Custom query method to find an organization by its name
    Optional<Organization> findByName(String name);

}