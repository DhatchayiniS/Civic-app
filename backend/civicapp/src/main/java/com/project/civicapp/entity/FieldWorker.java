package com.project.civicapp.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "field_worker")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FieldWorker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "local_body_id")
    private LocalBody localBody;

    @ManyToOne
    @JoinColumn(name = "ward_id")
    private Ward ward;
}
