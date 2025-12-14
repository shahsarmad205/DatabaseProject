package com.apartmentmanagement.controller;

import com.apartmentmanagement.entity.LeaseAgreement;
import com.apartmentmanagement.repository.LeaseAgreementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/leases")
@CrossOrigin
public class LeaseAgreementController {

    @Autowired
    private LeaseAgreementRepository leaseAgreementRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public List<LeaseAgreement> getAll() {
        return leaseAgreementRepository.findAll();
    }

    @GetMapping("/active")
    @Transactional(readOnly = true)
    public List<LeaseAgreement> getActiveLeases() {
        return leaseAgreementRepository.findActiveLeases();
    }

    @PostMapping
    public LeaseAgreement create(@RequestBody LeaseAgreement lease) {
        return leaseAgreementRepository.save(lease);
    }

    @PutMapping("/{id}")
    public LeaseAgreement update(@PathVariable Long id, @RequestBody LeaseAgreement lease) {
        lease.setId(id);
        return leaseAgreementRepository.save(lease);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        leaseAgreementRepository.deleteById(id);
    }
}
