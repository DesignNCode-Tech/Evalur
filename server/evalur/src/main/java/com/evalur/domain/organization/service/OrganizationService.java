package com.evalur.domain.organization.service;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.evalur.domain.organization.dto.OrganizationUpdateRequest;
import com.evalur.domain.organization.entity.Organization;
import com.evalur.domain.organization.repository.OrganizationRepository;

@Service
public class OrganizationService {

    @Autowired
    private OrganizationRepository orgRepository;

    public Organization getDetails(Long orgId) {
        return orgRepository.findById(orgId)
            .orElseThrow(() -> new RuntimeException("Organization not found"));
    }

    @Transactional
    public Organization updateProfile(Long orgId, OrganizationUpdateRequest request) {
        Organization org = getDetails(orgId);
        
        if (request.name() != null) org.setName(request.name());
        if (request.industry() != null) org.setIndustry(request.industry());
        if (request.website() != null) org.setWebsite(request.website());
        if (request.logoUrl() != null) org.setLogoUrl(request.logoUrl());
        if (request.contactPhone() != null) org.setContactPhone(request.contactPhone());

        return orgRepository.save(org);
    }
}