package com.apartmentmanagement.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Building {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String address;
    
    @OneToMany(mappedBy = "building")
    private List<ApartmentUnit> units;
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public List<ApartmentUnit> getUnits() { return units; }
    public void setUnits(List<ApartmentUnit> units) { this.units = units; }
}




