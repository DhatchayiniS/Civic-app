package com.project.civicapp.repository;

import com.project.civicapp.entity.Complaint;
import com.project.civicapp.entity.LocalBody;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocalBodyRepository extends JpaRepository<LocalBody, Long> {
//    List<Complaint> findByLocalBodyId(Long localBodyId);
}