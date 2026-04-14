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

    @Transactional //  Rolls back Organization creation if User creation fails
    public AuthResponse register(RegisterRequest request) {
        
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email is already in use.");
        }

        Organization organization;
        Role assignedRole;

        // ====================================================================
        // PATH A: The "Boss" creating a new Organization
        // ====================================================================
        if (request.organizationName() != null && !request.organizationName().isBlank()) {
            if (organizationRepository.existsByName(request.organizationName())) {
                throw new IllegalArgumentException("Organization name '" + request.organizationName() + "' is already taken.");
            }
            
            // Build and save the new Organization
            organization = new Organization();
            organization.setName(request.organizationName());
            organization = organizationRepository.save(organization);
            
            assignedRole = Role.ADMIN;
        } 
        // ====================================================================
        // PATH B: An employee/candidate joining via Invite Token
        // ====================================================================
        else if (request.inviteToken() != null && !request.inviteToken().isBlank()) {
            Long orgId = jwtProvider.extractOrgId(request.inviteToken());
            String roleString = jwtProvider.extractRole(request.inviteToken());

            // Find the existing Organization using the secure token
            organization = organizationRepository.findById(orgId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid invitation link: Organization not found."));
            
            assignedRole = Role.valueOf(roleString);
        } else {
            throw new IllegalArgumentException("Must provide either an Organization Name or an Invite Token.");
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
                .seniorityLevel(request.seniorityLevel()) 
                .build();

        userRepository.save(user);
        String jwtToken = jwtProvider.generateToken(user);

        // Returning your updated AuthResponse format
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