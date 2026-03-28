// This controller is for testing security configurations. It has endpoints that should only be accessible by certain roles.
// This is Not the actual User Controller that will handle real user operations.

package com.evalur.domain.user.controller;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.evalur.domain.user.dto.UserResponse;
import com.evalur.domain.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/test")
public class TestSecurityController {

    private final UserRepository UserRepository;

    @GetMapping("/student-only")
   // @PreAuthorize("hasRole('STUDENT')")
    public String studentRoute() {
        return "If you see this, you are a Student (or higher)!";
    }

    @GetMapping("/admin-only")
   // @PreAuthorize("hasRole('ADMIN')")
    public String adminRoute() {
        return "Only (ADMIN) can see this.";
    }

   @GetMapping("/get-users")
    public List<UserResponse> getUsers() {
        // 1. Create a request for the first 10 users (Page 0, Size 10)
        Pageable firstTen = PageRequest.of(0, 10);

        // 2. Fetch from DB, map to DTO, and return
        return UserRepository.findAll(firstTen)
                .stream()
                .map(user -> new UserResponse(
                        user.getName(),
                        user.getEmail(),
                        user.getRole(),
                        user.getInstitute() != null ? user.getInstitute().getName() : "No Institute"
                ))
                .toList();
    }
}