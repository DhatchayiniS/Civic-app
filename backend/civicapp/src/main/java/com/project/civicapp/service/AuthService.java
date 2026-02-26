package com.project.civicapp.service;

import com.project.civicapp.dto.LoginRequest;
import com.project.civicapp.dto.LoginResponse;
import com.project.civicapp.dto.SignupRequest;
import com.project.civicapp.entity.Role;
import com.project.civicapp.entity.User;
import com.project.civicapp.entity.Ward;
import com.project.civicapp.repository.UserRepository;
import com.project.civicapp.repository.WardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final WardRepository wardRepository;

    // 🔐 SIGNUP
    public String signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already registered!");
        }

        Ward ward = wardRepository.findById(request.getWardId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Invalid ward ID"));

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(request.getPassword()) // TODO: hash password
                .role(Role.USER) // Signup only for USER
                .ward(ward)
                .build();

        userRepository.save(user);

        return "User registered successfully!";
    }

    // 🔐 LOGIN
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Incorrect password");
        }

        return LoginResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .wardNo(user.getWard() != null ? user.getWard().getWardNo() : null)
                .build();
    }
}
