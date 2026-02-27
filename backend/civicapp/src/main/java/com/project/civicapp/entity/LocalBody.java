package com.project.civicapp.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "local_body")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LocalBody {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Enumerated(EnumType.STRING)
    private LocalBodyType type;

    @OneToMany(mappedBy = "localBody")
    @JsonManagedReference
    private List<Ward> wards;
}