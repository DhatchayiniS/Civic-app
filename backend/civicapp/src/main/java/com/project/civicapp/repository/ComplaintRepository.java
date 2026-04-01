package com.project.civicapp.repository;

import com.project.civicapp.entity.Complaint;
import com.project.civicapp.entity.LocalBody;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    List<Complaint> findByWard_WardNo(Integer wardNo);
    List<Complaint> findByWard_LocalBody_Id(Long localBodyId);


    List<Complaint> findByUser_Id(Long userId);

    List<Complaint> findByWard_LocalBody(LocalBody localBody);

    long countByStatus(String status);
}
