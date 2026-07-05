package com.expensetracker.controller;

import com.expensetracker.dto.UserProfileRequest;
import com.expensetracker.dto.UserProfileResponse;
import com.expensetracker.entity.User;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/profile")
    public UserProfileResponse getProfile(Authentication authentication) {
        User user = findUser(authentication.getName());
        return new UserProfileResponse(user.getId(), user.getName(), user.getEmail());
    }

    @PutMapping("/profile")
    public UserProfileResponse updateProfile(
            @Valid @RequestBody UserProfileRequest request,
            Authentication authentication) {

        User user = findUser(authentication.getName());
        user.setName(request.getName().trim());
        user = userRepository.save(user);

        return new UserProfileResponse(user.getId(), user.getName(), user.getEmail());
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
