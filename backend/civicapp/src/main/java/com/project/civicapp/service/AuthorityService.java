package com.project.civicapp.service;

import com.project.civicapp.dto.CreateAuthorityRequest;
import com.project.civicapp.dto.UpdateAuthorityRequest;
import com.project.civicapp.entity.*;
import com.project.civicapp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthorityService {

    private final UserRepository userRepository;
    private final AuthorityRepository authorityRepository;
    private final LocalBodyRepository localBodyRepository;

    public String createAuthority(CreateAuthorityRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");
        }

        LocalBody localBody = localBodyRepository.findById(request.getLocalBodyId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Invalid Local Body ID"));

        // Create user
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(request.getPassword()) // TODO: hash later
                .role(Role.LOCAL_BODY)
                .build();

        userRepository.save(user);

        // Create authority record
        Authority authority = Authority.builder()
                .user(user)
                .localBody(localBody)
                .build();

        authorityRepository.save(authority);

        return "Authority created successfully!";
    }

    public String updateAuthority(UpdateAuthorityRequest request) {

        // 1️⃣ Find authority by name
        Authority authority = authorityRepository
                .findByUser_Name(request.getName())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Authority doesn't exist"
                        )
                );

        // 2️⃣ Get new local body
        LocalBody newLocalBody = localBodyRepository.findById(request.getLocalBodyId())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.BAD_REQUEST,
                                "Invalid Local Body ID"
                        )
                );

        // 3️⃣ Prevent duplicate authority for same local body
        authorityRepository.findByLocalBody_Id(request.getLocalBodyId())
                .ifPresent(existing -> {
                    if (!existing.getId().equals(authority.getId())) {
                        throw new ResponseStatusException(
                                HttpStatus.BAD_REQUEST,
                                "Another authority already exists for this Local Body"
                        );
                    }
                });

        // 4️⃣ Update fields
        authority.setStatus(request.getStatus());
        authority.setLocalBody(newLocalBody);

        authorityRepository.save(authority);

        return "Authority updated successfully!";
    }

    public List<Authority> getAuthorities(Long localBodyId, AuthorityStatus status) {

        if (localBodyId != null && status != null) {
            return authorityRepository.findByLocalBody_IdAndStatus(localBodyId, status);
        }

        if (localBodyId != null) {
            return authorityRepository.findByLocalBody_Id(localBodyId)
                    .map(List::of)
                    .orElse(List.of());
        }

        if (status != null) {
            return authorityRepository.findByStatus(status);
        }

        return authorityRepository.findAll();
    }
}