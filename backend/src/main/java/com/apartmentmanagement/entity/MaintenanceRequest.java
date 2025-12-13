package com.apartmentmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class MaintenanceRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String description;
    private String status;
    private String priority;
    private LocalDate createdDate;
    
    @ManyToOne
    @JoinColumn(name = "apartment_unit_id")
    private ApartmentUnit apartmentUnit;
    
    @ManyToOne
    @JoinColumn(name = "tenant_id")
    private Tenant tenant;
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public LocalDate getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDate createdDate) { this.createdDate = createdDate; }
    public ApartmentUnit getApartmentUnit() { return apartmentUnit; }
    public void setApartmentUnit(ApartmentUnit apartmentUnit) { this.apartmentUnit = apartmentUnit; }
    public Tenant getTenant() { return tenant; }
    public void setTenant(Tenant tenant) { this.tenant = tenant; }
}




