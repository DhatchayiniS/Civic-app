package com.project.civicapp.dto;

import lombok.Data;

@Data
public class CreateAuthorityRequest {
    private String name;
    private String email;
    private String password;
    private Long localBodyId;
}