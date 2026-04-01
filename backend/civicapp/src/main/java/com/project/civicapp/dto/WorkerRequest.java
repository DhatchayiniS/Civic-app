package com.project.civicapp.dto;

import com.project.civicapp.entity.WorkerStatus;

public class WorkerRequest {

    private String name;
    private WorkerStatus status;
    private Long localBodyId; // ✅ THIS MUST COME FROM FRONTEND

    // Getters & Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public WorkerStatus getStatus() {
        return status;
    }

    public void setStatus(WorkerStatus status) {
        this.status = status;
    }

    public Long getLocalBodyId() {
        return localBodyId;
    }

    public void setLocalBodyId(Long localBodyId) {
        this.localBodyId = localBodyId;
    }
}