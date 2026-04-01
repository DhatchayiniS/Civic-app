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

    @OneToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @ManyToOne
    @JoinColumn(name = "local_body_id")
    private LocalBody localBody;

    @ManyToOne
    @JoinColumn(name = "ward_id",nullable = true)
    private Ward ward;

    @Enumerated(EnumType.STRING)
    private WorkerStatus status;

    @PrePersist
    public void setDefaultStatus() {
        if (this.status == null) {
            this.status = WorkerStatus.ACTIVE;
        }
    }
}
