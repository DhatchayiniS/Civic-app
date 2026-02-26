package com.project.civicapp.controller;

import com.project.civicapp.dto.LoginRequest;
import com.project.civicapp.dto.LoginResponse;
import com.project.civicapp.dto.SignupRequest;
import com.project.civicapp.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService authService;

    // 🔐 SIGNUP
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequest request) {
        return ResponseEntity.ok(authService.signup(request));
    }

    // 🔐 LOGIN
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest req) {
        try {
            // Call AuthService.login() which checks email & password
            LoginResponse loginResp = authService.login(req);

            // Prepare response for frontend
            Map<String, Object> resp = new HashMap<>();
            resp.put("id", loginResp.getId());
            resp.put("name", loginResp.getName());
            resp.put("email", loginResp.getEmail());
            resp.put("role", loginResp.getRole());
            resp.put("wardNo", loginResp.getWardNo()); // IMPORTANT

            return ResponseEntity.ok(resp);

        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(Map.of("error", e.getReason()));
        }
    }
}
