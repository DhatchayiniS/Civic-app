package com.project.civicapp.entity;

import jakarta.persistence.*;
import lombok.*;

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

    @ManyToOne
    @JoinColumn(name = "ward_id")
    private Ward ward;
}
