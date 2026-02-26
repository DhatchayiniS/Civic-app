package com.project.civicapp.repository;

import com.project.civicapp.entity.LocalBody;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocalBodyRepository extends JpaRepository<LocalBody, Long> {
}