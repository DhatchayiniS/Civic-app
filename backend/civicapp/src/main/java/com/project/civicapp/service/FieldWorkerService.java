package com.project.civicapp.service;

import com.project.civicapp.entity.FieldWorker;
import com.project.civicapp.repository.FieldWorkerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FieldWorkerService {

    private final FieldWorkerRepository fieldWorkerRepository;

    public void updateWorker(Long id, FieldWorker updatedWorker) {
        FieldWorker worker = fieldWorkerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Worker not found"));

        worker.setName(updatedWorker.getName());
        worker.setStatus(updatedWorker.getStatus());
        // set other fields

        fieldWorkerRepository.save(worker);
    }
}