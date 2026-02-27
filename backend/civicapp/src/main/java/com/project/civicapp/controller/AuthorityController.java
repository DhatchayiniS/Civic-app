package com.project.civicapp.controller;

import com.project.civicapp.dto.CreateAuthorityRequest;
import com.project.civicapp.dto.UpdateAuthorityRequest;
import com.project.civicapp.entity.Authority;
import com.project.civicapp.entity.AuthorityStatus;
import com.project.civicapp.repository.AuthorityRepository;
import com.project.civicapp.service.AuthorityService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class AuthorityController {

    private final AuthorityService authorityService;

    @PostMapping("/create-authority")
    public String createAuthority(@RequestBody CreateAuthorityRequest request) {
        return authorityService.createAuthority(request);
    }

    @PostMapping("/update-authority")
    public String updateAuthority(@RequestBody UpdateAuthorityRequest request) {
        return authorityService.updateAuthority(request);
    }

    @GetMapping("/authorities")
    public List<Authority> getAuthorities(@RequestParam(required = false) Long localBodyId, @RequestParam(required = false) AuthorityStatus status) {
        return authorityService.getAuthorities(localBodyId, status);
    }
}