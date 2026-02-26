package com.project.civicapp.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.project.civicapp.service.UserService;
import com.project.civicapp.entity.User;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin
public class UserController {

    private final UserService userService;

    @GetMapping("/{email}")
    public User getUser(@PathVariable String email) {
        return userService.getUserByEmail(email);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        return userService.updateUser(id, user);
    }
}
