package com.project.civicapp.controller;

import com.project.civicapp.entity.FieldWorker;
import com.project.civicapp.entity.LocalBody;
import com.project.civicapp.entity.Ward;
import com.project.civicapp.entity.WorkerStatus;
import com.project.civicapp.repository.FieldWorkerRepository;
import com.project.civicapp.repository.LocalBodyRepository;
import com.project.civicapp.service.FieldWorkerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.project.civicapp.dto.WorkerRequest;

import java.util.List;

@RestController
@RequestMapping("/api/workers")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class FieldWorkerController {

    private final FieldWorkerRepository fieldWorkerRepository;
    private final FieldWorkerService fieldWorkerService;
    private final LocalBodyRepository localBodyRepository;

    @GetMapping("/active/{localBodyId}")
    public ResponseEntity<?> getActiveWorkers(@PathVariable Long localBodyId) {

        LocalBody localBody = new LocalBody();
        localBody.setId(localBodyId);

        List<FieldWorker> workers =
                fieldWorkerRepository.findByLocalBodyAndStatus(localBody, WorkerStatus.ACTIVE);

        return ResponseEntity.ok(workers);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateWorker(
            @PathVariable Long id,
            @RequestBody FieldWorker updatedWorker
    ){
        fieldWorkerService.updateWorker(id, updatedWorker);
        return ResponseEntity.ok("Worker updated successfully");
    }

    @PostMapping
    public ResponseEntity<?> createWorker(@RequestBody WorkerRequest req) {
        if (req.getLocalBodyId() == null) {
            return ResponseEntity.badRequest().body("LocalBody ID cannot be null");
        }

        LocalBody localBody = localBodyRepository.findById(req.getLocalBodyId())
                .orElseThrow(() -> new RuntimeException("LocalBody not found"));

        FieldWorker worker = new FieldWorker();
        worker.setName(req.getName());
        worker.setStatus(req.getStatus());
        worker.setLocalBody(localBody);

        fieldWorkerRepository.save(worker);

        return ResponseEntity.ok("Worker Created Successfully");
    }
}
