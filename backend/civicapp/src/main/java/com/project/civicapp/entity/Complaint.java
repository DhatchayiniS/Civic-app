package com.project.civicapp.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String issueType;
    private String description;

    private Double latitude;
    private Double longitude;

    @ManyToOne
    @JoinColumn(name = "ward_id")
    private Ward ward;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String imageName;

    private String completionImage; // store file path

    private LocalDateTime createdAt;

    private String status;


    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
