package com.project.civicapp.controller;

import com.project.civicapp.entity.Ward;
import com.project.civicapp.service.WardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wards")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class WardController {

    private final WardService wardService;

    @GetMapping("/{wardNo}")
    public ResponseEntity<Ward> getWard(@PathVariable Integer wardNo) {
        try {
            Ward ward = wardService.getWardByNumber(wardNo);
            return ResponseEntity.ok(ward);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
