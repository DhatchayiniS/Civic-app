package com.project.civicapp.repository;

import com.project.civicapp.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FieldWorkerRepository extends JpaRepository<FieldWorker, Long> {

    List<FieldWorker> findByLocalBodyAndStatus(LocalBody localBody, WorkerStatus status);

    List<FieldWorker> findByLocalBody(LocalBody localBody);

    Optional<FieldWorker> findByUser(User user);
}