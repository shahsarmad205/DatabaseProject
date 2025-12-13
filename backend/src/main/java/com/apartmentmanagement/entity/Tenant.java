package com.apartmentmanagement.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Tenant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String email;
    private String phone;
    
    @OneToMany(mappedBy = "tenant")
    private List<LeaseAgreement> leases;
    
    @OneToMany(mappedBy = "tenant")
    private List<MaintenanceRequest> maintenanceRequests;
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public List<LeaseAgreement> getLeases() { return leases; }
    public void setLeases(List<LeaseAgreement> leases) { this.leases = leases; }
    public List<MaintenanceRequest> getMaintenanceRequests() { return maintenanceRequests; }
    public void setMaintenanceRequests(List<MaintenanceRequest> maintenanceRequests) { this.maintenanceRequests = maintenanceRequests; }
}




