package com.apartmentmanagement.repository;

import com.apartmentmanagement.entity.MaintenanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Long> {
    List<MaintenanceRequest> findByStatus(String status);
    List<MaintenanceRequest> findByPriority(String priority);
    @Query("SELECT mr FROM MaintenanceRequest mr WHERE mr.apartmentUnit.building.id = :buildingId")
    List<MaintenanceRequest> findByBuildingId(@Param("buildingId") Long buildingId);
}




