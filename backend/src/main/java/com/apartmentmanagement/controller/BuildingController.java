package com.apartmentmanagement.controller;

import com.apartmentmanagement.entity.Building;
import com.apartmentmanagement.entity.Tenant;
import com.apartmentmanagement.repository.BuildingRepository;
import com.apartmentmanagement.repository.LeaseAgreementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/buildings")
@CrossOrigin
public class BuildingController {
    
    @Autowired
    private BuildingRepository buildingRepository;
    
    @Autowired
    private LeaseAgreementRepository leaseAgreementRepository;
    
    @GetMapping
    public List<Building> getAll() {
        return buildingRepository.findAll();
    }
    
    @PostMapping
    public Building create(@RequestBody Building building) {
        return buildingRepository.save(building);
    }
    
    @PutMapping("/{id}")
    public Building update(@PathVariable Long id, @RequestBody Building building) {
        building.setId(id);
        return buildingRepository.save(building);
    }
    
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        buildingRepository.deleteById(id);
    }
    
    @GetMapping("/{buildingId}/tenants")
    public List<Tenant> getTenantsByBuilding(@PathVariable Long buildingId) {
        return leaseAgreementRepository.findAll().stream()
            .filter(l -> l.getApartmentUnit().getBuilding().getId().equals(buildingId))
            .map(l -> l.getTenant())
            .distinct()
            .collect(Collectors.toList());
    }
}




