package com.project.civicapp.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "wards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ward {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private Integer wardNo;

    // Geographical boundary of the ward
    @Column(nullable = false)
    private Double minLatitude;

    @Column(nullable = false)
    private Double maxLatitude;

    @Column(nullable = false)
    private Double minLongitude;

    @Column(nullable = false)
    private Double maxLongitude;

    @ManyToOne
    @JoinColumn(name = "local_body_id")
    @JsonBackReference
    private LocalBody localBody;
}
