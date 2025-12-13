package com.apartmentmanagement.repository;

import com.apartmentmanagement.entity.ApartmentUnit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApartmentUnitRepository extends JpaRepository<ApartmentUnit, Long> {
}




