package com.evalur.domain.organization.dto;

public record OrganizationUpdateRequest(
    String name,
    String industry,
    String website,
    String logoUrl,
    String contactPhone
) {}