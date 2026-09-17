package com.pavel.rozpocetbackend.controller;

import com.pavel.rozpocetbackend.entity.IncomeSource;
import com.pavel.rozpocetbackend.service.IncomeSourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/income-sources")
public class IncomeSourceController {

    @Autowired
    private IncomeSourceService incomeSourceService;

    @GetMapping
    public List<IncomeSource> getAllIncomeSources() {
        return incomeSourceService.getAllIncomeSources();
    }

    @PostMapping
    public IncomeSource addIncomeSource(@RequestBody IncomeSource incomeSource) {
        return incomeSourceService.addIncomeSource(incomeSource);
    }

    // Update existujícího zdroje příjmu.
    @PutMapping("/{id}")
    public IncomeSource updateIncomeSource(@PathVariable Long id,
                                           @RequestBody IncomeSource incomeSource) {
        return incomeSourceService.updateIncomeSource(id, incomeSource);
    }

    // Smazání zdroje příjmu podle ID.
    @DeleteMapping("/{id}")
    public void deleteIncomeSource(@PathVariable Long id) {
        incomeSourceService.deleteIncomeSource(id);
    }
}