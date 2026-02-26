package com.project.civicapp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.project.civicapp.repository.UserRepository;
import com.project.civicapp.entity.User;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUser(Long id, User updatedUser) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(updatedUser.getName());
        user.setWard(updatedUser.getWard());

        return userRepository.save(user);
    }
}
