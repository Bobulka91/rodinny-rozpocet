package com.pavel.rozpocetbackend.controller;

import com.pavel.rozpocetbackend.entity.IncomeSource;
import com.pavel.rozpocetbackend.service.IncomeSourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Třída IncomeSourceController je zodpovědná za zpracování HTTP požadavků
 * týkajících se trvalých zdrojů příjmů (šablon). Obsahuje metody pro získání
 * všech zdrojů, přidání nového, aktualizaci existujícího a smazání.
 */
@RestController  // Označení třídy jako REST Controller
@RequestMapping("/api/income-sources")  // Základní URL pro všechny endpointy v tomto controlleru
public class IncomeSourceController {

    @Autowired  // Automatické injektování instance IncomeSourceService
    private IncomeSourceService incomeSourceService;

    @GetMapping  // Endpoint pro získání všech zdrojů příjmů
    public List<IncomeSource> getAllIncomeSources() {
        return incomeSourceService.getAllIncomeSources();
    }

    @PostMapping  // Endpoint pro vytvoření nového zdroje příjmu
    public IncomeSource addIncomeSource(@RequestBody IncomeSource incomeSource) {
        return incomeSourceService.addIncomeSource(incomeSource);
    }

    /**
     * Aktualizuje existující zdroj příjmu podle ID.
     */
    @PutMapping("/{id}")  // PUT /api/income-sources/{id}
    public IncomeSource updateIncomeSource(@PathVariable Long id, @RequestBody IncomeSource incomeSource) {
        return incomeSourceService.update(id, incomeSource);
    }

    /**
     * Smaže zdroj příjmu podle ID.
     */
    @DeleteMapping("/{id}")  // DELETE /api/income-sources/{id}
    public ResponseEntity<Void> deleteIncomeSource(@PathVariable Long id) {
        incomeSourceService.delete(id);
        return ResponseEntity.noContent().build();  // HTTP 204 - úspěšně smazáno, žádná data k vrácení
    }
}