package com.project.civicapp.dto;
import com.project.civicapp.entity.LocalBody;
import lombok.Data;

import java.util.List;

@Data
public class LocalBodyRequest {
    private LocalBody localBody;
    private List<Long> wardIds; // selected wards
}
