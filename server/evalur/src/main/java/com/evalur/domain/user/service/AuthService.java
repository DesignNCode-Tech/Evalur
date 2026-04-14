package com.evalur.domain.user.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; 

import com.evalur.domain.organization.entity.Organization;
import com.evalur.domain.organization.repository.OrganizationRepository;
import com.evalur.domain.user.dto.AuthResponse;
import com.evalur.domain.user.dto.LoginRequest;
import com.evalur.domain.user.dto.RegisterRequest;
import com.evalur.domain.user.entity.Role;
import com.evalur.domain.user.entity.User;
import com.evalur.domain.user.repository.UserRepository;
import com.evalur.security.jwtAuth.JwtProvider;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final AuthenticationManager authenticationManager;

  @Transactional
    public AuthResponse register(RegisterRequest request) {
        
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email is already in use.");
        }

        Organization organization;
        Role assignedRole;
        String assignedSeniority; 

        // ====================================================================
        // PATH 1 (PRIORITY): Joining via Invite Token
        // ====================================================================
        // We check this FIRST. If a token exists, we don't care about the org name.
        if (request.inviteToken() != null && !request.inviteToken().isBlank()) {
            Long orgId = jwtProvider.extractOrgId(request.inviteToken());
            String roleString = jwtProvider.extractRole(request.inviteToken());
            String seniorityFromToken = jwtProvider.extractSeniority(request.inviteToken());

            organization = organizationRepository.findById(orgId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid invitation link: Organization not found."));
            
            assignedRole = Role.valueOf(roleString);
            assignedSeniority = seniorityFromToken; // Force seniority from the secure token
        } 
        // ====================================================================
        // PATH 2: Creating a new Organization (The "Boss" path)
        // ====================================================================
        else if (request.organizationName() != null && !request.organizationName().isBlank()) {
            if (organizationRepository.existsByName(request.organizationName())) {
                throw new IllegalArgumentException("Organization name '" + request.organizationName() + "' is already taken.");
            }
            
            organization = new Organization();
            organization.setName(request.organizationName());
            organization = organizationRepository.save(organization);
            
            assignedRole = Role.ADMIN;
            assignedSeniority = request.seniorityLevel(); // Boss sets their own seniority
        } 
        else {
            throw new IllegalArgumentException("Registration failed: Provide an Organization Name to start a new company, or use an Invite Token to join one.");
        }

        // ====================================================================
        // CREATE THE USER
        // ====================================================================
        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(assignedRole) 
                .organization(organization) 
                .seniorityLevel(assignedSeniority) 
                .build();

        userRepository.save(user);
        String jwtToken = jwtProvider.generateToken(user);

        return new AuthResponse(jwtToken, user.getEmail(), user.getRole(), "Registration successful");
    }
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

        String jwtToken = jwtProvider.generateToken(user);

        return new AuthResponse(jwtToken, user.getEmail(), user.getRole(), "Login successful");
    }
}