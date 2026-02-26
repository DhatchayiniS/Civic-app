package com.project.civicapp.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    @JsonIgnore
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    @ManyToOne
    @JoinColumn(name = "ward_id")
    private Ward ward;

    @ManyToOne
    @JoinColumn(name = "local_body_id", nullable = true) // only for officers
    private LocalBody localBody;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}