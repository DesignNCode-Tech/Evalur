package com.evalur.domain.user.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody; // 👈 Don't forget this import
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.evalur.domain.user.dto.InviteRequest;
import com.evalur.domain.user.entity.User;
import com.evalur.domain.user.repository.UserRepository;
import com.evalur.security.jwtAuth.JwtProvider;

import lombok.RequiredArgsConstructor;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/org")
@RequiredArgsConstructor
public class InvitationController {

    private final JwtProvider jwtProvider;
    private final UserRepository userRepository; 

    @Value("${evalur.client.url}") 
    private String clientUrl; 

    @PostMapping("/invite")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Transactional(readOnly = true) 
    public ResponseEntity<Map<String, String>> generateInvite(
            @Valid @RequestBody InviteRequest request, 
            @AuthenticationPrincipal User currentUser
    ) {
        
        // 1. Fetch fresh user to avoid LazyInitializationException
        User attachedUser = userRepository.findByEmail(currentUser.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Extract Organization data
        Long orgId = attachedUser.getOrganization().getId();
        String orgName = attachedUser.getOrganization().getName();

        // 3. Generate the secure token with baked-in Role and Seniority
        String inviteToken = jwtProvider.generateInviteToken(
            orgId, 
            orgName,
            request.role(), 
            request.seniorityLevel()
        );

        String inviteLink = clientUrl + "/auth/register/join?token=" + inviteToken;

        return ResponseEntity.ok(Map.of(
            "message", "Invite link generated successfully",
            "inviteLink", inviteLink
        ));
    }
}