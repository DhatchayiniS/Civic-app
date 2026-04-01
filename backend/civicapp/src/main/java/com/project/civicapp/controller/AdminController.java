package com.project.civicapp.controller;

import com.project.civicapp.repository.ComplaintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final ComplaintRepository complaintRepository;

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboardStats() {

        Map<String, Object> stats = new HashMap<>();

        long total = complaintRepository.count();
        long pending = complaintRepository.countByStatus("PENDING");
        long assigned = complaintRepository.countByStatus("ASSIGNED");
        long completed = complaintRepository.countByStatus("COMPLETED");

        stats.put("total", total);
        stats.put("pending", pending);
        stats.put("assigned", assigned);
        stats.put("completed", completed);

        return stats;
    }
}