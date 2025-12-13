package com.apartmentmanagement.controller;

import com.apartmentmanagement.entity.Tenant;
import com.apartmentmanagement.repository.TenantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tenants")
@CrossOrigin
public class TenantController {
    
    @Autowired
    private TenantRepository tenantRepository;
    
    @GetMapping
    public List<Tenant> getAll() {
        return tenantRepository.findAll();
    }
    
    @PostMapping
    public Tenant create(@RequestBody Tenant tenant) {
        return tenantRepository.save(tenant);
    }
    
    @PutMapping("/{id}")
    public Tenant update(@PathVariable Long id, @RequestBody Tenant tenant) {
        tenant.setId(id);
        return tenantRepository.save(tenant);
    }
    
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        tenantRepository.deleteById(id);
    }
}




