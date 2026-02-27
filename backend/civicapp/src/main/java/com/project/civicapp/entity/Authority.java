package com.project.civicapp.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "authority")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Authority {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to users table
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Link to LocalBody
    @ManyToOne
    @JoinColumn(name = "local_body_id", nullable = false)
    private LocalBody localBody;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuthorityStatus status;

    @PrePersist
    public void setDefaultStatus() {
        if (this.status == null) {
            this.status = AuthorityStatus.ACTIVE;
        }
    }
}