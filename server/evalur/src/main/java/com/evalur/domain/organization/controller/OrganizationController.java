package com.evalur.domain.organization.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.evalur.domain.organization.dto.OrganizationUpdateRequest;
import com.evalur.domain.organization.entity.Organization;
import com.evalur.domain.organization.service.OrganizationService;
import com.evalur.security.utils.SecurityUtils;

@RestController
@RequestMapping("/org")
public class OrganizationController {

    @Autowired
    private OrganizationService orgService;

    @GetMapping("/profile")
    public ResponseEntity<Organization> getOrgProfile() {
        Long orgId = SecurityUtils.getCurrentOrgId(); 
        return ResponseEntity.ok(orgService.getDetails(orgId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/profile")
    public ResponseEntity<Organization> updateOrgProfile(
        @RequestBody OrganizationUpdateRequest request
    ) {
        Long orgId = SecurityUtils.getCurrentOrgId();
        return ResponseEntity.ok(orgService.updateProfile(orgId, request));
    }
}