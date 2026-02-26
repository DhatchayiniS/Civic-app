package com.project.civicapp.service;

import com.project.civicapp.entity.Ward;
import com.project.civicapp.repository.WardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WardService {

    private final WardRepository wardRepository;

    // Get Ward by ward number
    public Ward getWardByNumber(Integer wardNo) {
        return wardRepository.findByWardNo(wardNo)
                .orElseThrow(() -> new RuntimeException("Ward not found with wardNo: " + wardNo));
    }
}
