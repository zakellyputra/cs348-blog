package com.zakellyputra.cs348.cs348_database.controller;

import com.zakellyputra.cs348.cs348_database.dto.UserResponse;
import com.zakellyputra.cs348.cs348_database.model.User;
import com.zakellyputra.cs348.cs348_database.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> listUsers() {
        List<UserResponse> users = userRepository.findAll().stream()
                .map(u -> new UserResponse(u.getUserId(), u.getUsername(),
                        u.getEmail(), u.getRole().getRoleName()))
                .toList();
        return ResponseEntity.ok(users);
    }
}
