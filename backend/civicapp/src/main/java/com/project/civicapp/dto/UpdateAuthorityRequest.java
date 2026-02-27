package com.project.civicapp.dto;

import lombok.Data;
import com.project.civicapp.entity.AuthorityStatus;

@Data
public class UpdateAuthorityRequest {

    private String name;        // used to find authority
    private Long localBodyId;   // can be changed
    private AuthorityStatus status;

}