package com.evalur.domain.user.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.evalur.domain.organization.entity.Organization;
import com.evalur.domain.organization.repository.OrganizationRepository;
import com.evalur.domain.user.dto.AuthResponse;
import com.evalur.domain.user.dto.LoginRequest;
import com.evalur.domain.user.dto.RegisterRequest;
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

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email is already in use.");
        }

        // 1. Fetch the actual Organization from the database
        Organization organization = organizationRepository.findById(request.organizationId())
                .orElseThrow(() -> new IllegalArgumentException("Organization not found."));

        // 2. Build the complete User
       User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(request.role()) 
                .organization(organization) 
                .seniorityLevel(request.seniorityLevel()) 
                .build();
        // 3. Save and Generate Token
        userRepository.save(user);
        String jwtToken = jwtProvider.generateToken(user);

        return new AuthResponse(jwtToken, user.getEmail(), user.getRole(), "Registration successful");
    }

    public AuthResponse login(LoginRequest request) {
        // This will automatically check the hashed password against the DB
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

        String jwtToken = jwtProvider.generateToken(user);

        return new AuthResponse(jwtToken, user.getEmail(), user.getRole(), "Login successful");
    }
}
