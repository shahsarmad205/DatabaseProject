package com.apartmentmanagement.repository;

import com.apartmentmanagement.entity.LeaseAgreement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LeaseAgreementRepository extends JpaRepository<LeaseAgreement, Long> {
    @Query("SELECT l FROM LeaseAgreement l WHERE l.isActive = true")
    List<LeaseAgreement> findActiveLeases();
}




