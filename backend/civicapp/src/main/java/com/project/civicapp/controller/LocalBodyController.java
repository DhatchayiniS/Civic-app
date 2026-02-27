package com.project.civicapp.controller;

import com.project.civicapp.entity.LocalBody;
import com.project.civicapp.repository.LocalBodyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class LocalBodyController {

    private final LocalBodyRepository localBodyRepository;

    @GetMapping("/local-bodies")
    public List<LocalBody> getAllLocalBodies() {
        return localBodyRepository.findAll();
    }
}