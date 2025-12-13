package com.apartmentmanagement.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class ApartmentUnit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String unitNumber;
    private Integer bedrooms;
    private Double rent;
    
    @ManyToOne
    @JoinColumn(name = "building_id")
    private Building building;
    
    @OneToMany(mappedBy = "apartmentUnit")
    private List<LeaseAgreement> leases;
    
    @OneToMany(mappedBy = "apartmentUnit")
    private List<MaintenanceRequest> maintenanceRequests;
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUnitNumber() { return unitNumber; }
    public void setUnitNumber(String unitNumber) { this.unitNumber = unitNumber; }
    public Integer getBedrooms() { return bedrooms; }
    public void setBedrooms(Integer bedrooms) { this.bedrooms = bedrooms; }
    public Double getRent() { return rent; }
    public void setRent(Double rent) { this.rent = rent; }
    public Building getBuilding() { return building; }
    public void setBuilding(Building building) { this.building = building; }
    public List<LeaseAgreement> getLeases() { return leases; }
    public void setLeases(List<LeaseAgreement> leases) { this.leases = leases; }
    public List<MaintenanceRequest> getMaintenanceRequests() { return maintenanceRequests; }
    public void setMaintenanceRequests(List<MaintenanceRequest> maintenanceRequests) { this.maintenanceRequests = maintenanceRequests; }
}




