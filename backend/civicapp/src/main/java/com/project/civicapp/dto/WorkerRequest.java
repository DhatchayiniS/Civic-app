package com.project.civicapp.dto;

import com.project.civicapp.entity.WorkerStatus;

public class WorkerRequest {

    private String name;
    private WorkerStatus status;
    private Long localBodyId;
    private String email;
    private String password;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public WorkerStatus getStatus() { return status; }
    public void setStatus(WorkerStatus status) { this.status = status; }

    public Long getLocalBodyId() { return localBodyId; }
    public void setLocalBodyId(Long localBodyId) { this.localBodyId = localBodyId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}