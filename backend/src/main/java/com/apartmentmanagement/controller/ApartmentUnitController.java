package com.apartmentmanagement.controller;

import com.apartmentmanagement.entity.ApartmentUnit;
import com.apartmentmanagement.repository.ApartmentUnitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/apartment-units")
@CrossOrigin
public class ApartmentUnitController {

    @Autowired
    private ApartmentUnitRepository apartmentUnitRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public List<ApartmentUnit> getAll() {
        return apartmentUnitRepository.findAll();
    }

    @PostMapping
    public ApartmentUnit create(@RequestBody ApartmentUnit unit) {
        return apartmentUnitRepository.save(unit);
    }

    @PutMapping("/{id}")
    public ApartmentUnit update(@PathVariable Long id, @RequestBody ApartmentUnit unit) {
        unit.setId(id);
        return apartmentUnitRepository.save(unit);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        apartmentUnitRepository.deleteById(id);
    }
}
