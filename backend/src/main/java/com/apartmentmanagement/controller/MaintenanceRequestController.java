package com.apartmentmanagement.controller;

import com.apartmentmanagement.entity.MaintenanceRequest;
import com.apartmentmanagement.repository.MaintenanceRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@CrossOrigin
public class MaintenanceRequestController {

    @Autowired
    private MaintenanceRequestRepository maintenanceRequestRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public List<MaintenanceRequest> getAll() {
        return maintenanceRequestRepository.findAll();
    }

    @GetMapping("/status/{status}")
    @Transactional(readOnly = true)
    public List<MaintenanceRequest> getByStatus(@PathVariable String status) {
        return maintenanceRequestRepository.findByStatus(status);
    }

    @GetMapping("/priority/{priority}")
    @Transactional(readOnly = true)
    public List<MaintenanceRequest> getByPriority(@PathVariable String priority) {
        return maintenanceRequestRepository.findByPriority(priority);
    }

    @PostMapping
    public MaintenanceRequest create(@RequestBody MaintenanceRequest request) {
        return maintenanceRequestRepository.save(request);
    }

    @PutMapping("/{id}")
    public MaintenanceRequest update(@PathVariable Long id, @RequestBody MaintenanceRequest request) {
        request.setId(id);
        return maintenanceRequestRepository.save(request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        maintenanceRequestRepository.deleteById(id);
    }
}
