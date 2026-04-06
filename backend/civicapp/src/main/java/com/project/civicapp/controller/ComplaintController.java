package com.project.civicapp.controller;

import com.project.civicapp.entity.Complaint;
import com.project.civicapp.entity.LocalBody;
import com.project.civicapp.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ComplaintController {

    private final ComplaintService complaintService;

    @PostMapping
    public ResponseEntity<?> submitComplaint(
            @RequestParam String issueType,
            @RequestParam String description,
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam Integer wardId,
            @RequestParam Long userId,
            @RequestParam(required = false) MultipartFile image
    ) {
        try {
            Complaint complaint = complaintService.saveComplaint(
                    issueType, description, latitude, longitude,
                    wardId, userId, image
            );
            return ResponseEntity.ok(complaint);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/ward/{wardNo}")
    public ResponseEntity<?> getComplaintsByWard(@PathVariable Integer wardNo) {
        return ResponseEntity.ok(complaintService.getComplaintsByWard(wardNo));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getComplaintsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(complaintService.getComplaintsByUser(userId));
    }

    @GetMapping
    public ResponseEntity<?> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @PutMapping("/assign")
    public ResponseEntity<?> assignComplaint(
            @RequestParam Long complaintId,
            @RequestParam Long workerId
    ) {
        try {
            complaintService.assignComplaint(complaintId, workerId);
            return ResponseEntity.ok("Assigned successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/localbody/{localBodyId}")
    public ResponseEntity<?> getByLocalBody(@PathVariable Long localBodyId) {

        LocalBody localBody = new LocalBody();
        localBody.setId(localBodyId);

        return ResponseEntity.ok(
                complaintService.getComplaintsByLocalBody(localBody)
        );
    }

    @GetMapping("/worker/{workerId}")
    public ResponseEntity<?> getByWorker(@PathVariable Long workerId) {
        return ResponseEntity.ok(complaintService.getComplaintsByWorker(workerId));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeComplaint(
            @PathVariable Long id,
            @RequestParam(required = false) MultipartFile completionImage
    ) {
        try {
            Complaint complaint = complaintService.completeComplaint(id, completionImage);
            return ResponseEntity.ok(complaint);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}