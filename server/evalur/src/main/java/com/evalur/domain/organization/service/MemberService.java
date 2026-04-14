package com.evalur.domain.organization.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.evalur.domain.organization.dto.MemberResponse;
import com.evalur.domain.user.repository.UserRepository;
import com.evalur.security.utils.SecurityUtils;

import lombok.RequiredArgsConstructor;


// Service class to handle business logic related to organization members
@Service
@RequiredArgsConstructor
public class MemberService {

    private final UserRepository userRepository;

    public List<MemberResponse> getOrganizationMembers() {
        Long orgId = SecurityUtils.getCurrentOrgId();
        
        return userRepository.findByOrganizationId(orgId).stream()
                .map(user -> new MemberResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole(),
                        user.getSeniorityLevel()
                ))
                .collect(Collectors.toList());
    }
}