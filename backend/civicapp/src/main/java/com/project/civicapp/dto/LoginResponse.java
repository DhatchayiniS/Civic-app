package com.project.civicapp.dto;

import com.project.civicapp.entity.Role;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class LoginResponse {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private Integer wardNo;
    private Long localBodyId;
    private Long workerId;
}
