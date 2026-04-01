package com.project.civicapp.service;

import com.project.civicapp.entity.Complaint;
import com.project.civicapp.entity.User;
import com.project.civicapp.entity.Ward;
import com.project.civicapp.repository.ComplaintRepository;
import com.project.civicapp.repository.UserRepository;
import com.project.civicapp.repository.WardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;
import java.io.IOException;

import com.project.civicapp.entity.*;
import com.project.civicapp.repository.*;
import org.springframework.beans.factory.annotation.Value;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final WardRepository wardRepository;
    private final FieldWorkerRepository fieldWorkerRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public Complaint saveComplaint(String issueType,
                                   String description,
                                   Double latitude,
                                   Double longitude,
                                   Integer wardNo,
                                   Long userId,
                                   MultipartFile image) throws IOException {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Ward ward = wardRepository.findByWardNo(wardNo)
                .orElseThrow(() -> new RuntimeException("Ward not found"));

        Complaint complaint = Complaint.builder()
                .issueType(issueType)
                .description(description)
                .latitude(latitude)
                .longitude(longitude)
                .ward(ward)
                .user(user)
                .status("PENDING")
                .build();

        if (image != null && !image.isEmpty()) {

            if (!image.getContentType().startsWith("image/")) {
                throw new RuntimeException("Only image files allowed");
            }

            String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();

            // Absolute path
            String absoluteUploadPath = System.getProperty("user.dir") + File.separator + uploadDir;

            File uploadFolder = new File(absoluteUploadPath);
            if (!uploadFolder.exists()) {
                uploadFolder.mkdirs();
            }

            File destination = new File(uploadFolder, fileName);

            image.transferTo(destination);

            complaint.setImageName(fileName);
        }

        return complaintRepository.save(complaint);
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    public List<Complaint> getComplaintsByLocalBody(LocalBody localBody) {
        return complaintRepository.findByWard_LocalBody(localBody);
    }

    public List<Complaint> getComplaintsByWard(Integer wardNo) {
        return complaintRepository.findByWard_WardNo(wardNo);
    }

    public List<Complaint> getComplaintsByUser(Long userId) {
        return complaintRepository.findByUser_Id(userId);
    }
    public void assignComplaint(Long complaintId, Long workerId) {

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        FieldWorker worker = fieldWorkerRepository.findById(workerId)
                .orElseThrow(() -> new RuntimeException("Worker not found"));

        if (worker.getStatus() != WorkerStatus.ACTIVE) {
            throw new RuntimeException("Worker is inactive");
        }

        complaint.setFieldWorker(worker);
        complaint.setStatus("ASSIGNED");

        complaintRepository.save(complaint);
    }

    public List<Complaint> getComplaintsByWorker(Long workerId) {
        return complaintRepository.findByFieldWorker_Id(workerId);
    }

    public void completeComplaint(Long complaintId, MultipartFile image) throws IOException {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        if (image != null && !image.isEmpty()) {
            if (!image.getContentType().startsWith("image/")) {
                throw new RuntimeException("Only image files allowed");
            }
            String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
            String absoluteUploadPath = System.getProperty("user.dir") + File.separator + uploadDir;
            File uploadFolder = new File(absoluteUploadPath);
            if (!uploadFolder.exists()) uploadFolder.mkdirs();
            image.transferTo(new File(uploadFolder, fileName));
            complaint.setCompletionImage(fileName);
        }

        complaint.setStatus("COMPLETED");
        complaintRepository.save(complaint);
    }
}





