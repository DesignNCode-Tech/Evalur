package com.evalur.domain.user.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.evalur.domain.user.entity.User;
import com.evalur.domain.user.repository.UserRepository;
import com.evalur.security.jwtAuth.JwtProvider;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/org")
@RequiredArgsConstructor
public class InvitationController {

    private final JwtProvider jwtProvider;
    // 1. Inject the repository
    private final UserRepository userRepository; 

    @Value("${evalur.client.url}") 
    private String clientUrl; 

    @PostMapping("/invite")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Transactional(readOnly = true) 
    public ResponseEntity<Map<String, String>> generateInvite(@AuthenticationPrincipal User currentUser) {
        
        //  2. Fetch a fresh, database-attached user
        User attachedUser = userRepository.findByEmail(currentUser.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3. Call getOrganization() on the fresh user. H
        Long orgId = attachedUser.getOrganization().getId();
        String orgName = attachedUser.getOrganization().getName(); 

        String inviteToken = jwtProvider.generateInviteToken(orgId, "CANDIDATE");
        String inviteLink = clientUrl + "/register/join?token=" + inviteToken;

        // System.out.println("\n--- INVITATION GENERATED ---");
        // System.out.println("Org: " + orgName + " | Link: " + inviteLink);
        // System.out.println("----------------------------\n");

        return ResponseEntity.ok(Map.of(
            "message", "Invite link generated",
            "inviteLink", inviteLink
        ));
    }
}