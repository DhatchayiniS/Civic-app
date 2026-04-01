package com.project.civicapp.repository;

import com.project.civicapp.entity.Authority;
import com.project.civicapp.entity.AuthorityStatus;
import com.project.civicapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AuthorityRepository extends JpaRepository<Authority, Long> {

    Optional<Authority> findByUser(User user);

    Optional<Authority> findByLocalBody_Id(Long localBodyId);
    Optional<Authority> findByUser_Name(String name);

    List<Authority> findByLocalBody_IdAndStatus(Long localBodyId, AuthorityStatus status);

    List<Authority> findByStatus(AuthorityStatus status);
}