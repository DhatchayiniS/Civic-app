package com.project.civicapp.repository;

import com.project.civicapp.entity.Ward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WardRepository extends JpaRepository<Ward, Long> {

    // Fetch ward by wardNo (returns Optional)
    Optional<Ward> findByWardNo(Integer wardNo);
}
