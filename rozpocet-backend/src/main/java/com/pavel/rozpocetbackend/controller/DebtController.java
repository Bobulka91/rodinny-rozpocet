package com.pavel.rozpocetbackend.controller;

import com.pavel.rozpocetbackend.dto.DebtDTO;
import com.pavel.rozpocetbackend.entity.Debt;
import com.pavel.rozpocetbackend.mapper.DebtMapper;
import com.pavel.rozpocetbackend.service.DebtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Třída DebtController je zodpovědná za zpracování HTTP požadavků týkajících se dluhů.
 * Obsahuje metody pro získání všech dluhů, přidání nového dluhu, získání procentuálního
 * pokroku konkrétního dluhu a získání celkové sumy všech dluhů a celkové splacené sumy
 * napříč všemi dluhy.
 */

@RestController  // označuje třídu jako REST controller, který zpracovává HTTP požadavky a vrací JSON odpovědi
@RequestMapping("/api/debts")  // nastavuje základní URL cestu pro všechny metody v tomto controlleru
public class DebtController {

    @Autowired
    private DebtService debtService;

    @GetMapping
    public List<DebtDTO> getAllDebts() {
        return debtService.getAllDebts()
                .stream()
                .map(DebtMapper::toDTO)
                .toList();
    }

    @PostMapping
    public DebtDTO addDebt(@RequestBody DebtDTO debtDTO) {
        Debt debtEntity = DebtMapper.toEntity(debtDTO);
        Debt savedDebt = debtService.addDebt(debtEntity);
        return DebtMapper.toDTO(savedDebt);
    }

    // Procentuální pokrok konkrétního dluhu
    @GetMapping("/{id}/progress")
    public Double getProgress(@PathVariable Long id) {
        return debtService.getPaidPercentage(id);
    }

    // NOVÉ: Celková suma všech dluhů
    @GetMapping("/total-amount")
    public Double getTotalDebtAmount() {
        return debtService.getTotalDebtAmount();
    }

    // NOVÉ: Celková splacená suma napříč všemi dluhy
    @GetMapping("/total-paid")
    public Double getTotalPaidAmount() {
        return debtService.getTotalPaidAmount();
    }

    /**
     * Aktualizuje existující dluh podle ID.
     */
    @PutMapping("/{id}")  // PUT /api/debts/{id}
    public DebtDTO updateDebt(@PathVariable Long id, @RequestBody DebtDTO debtDTO) {
        Debt debtEntity = DebtMapper.toEntity(debtDTO);
        Debt updated = debtService.update(id, debtEntity);
        return DebtMapper.toDTO(updated);
    }

    /**
     * Smaže dluh podle ID.
     */
    @DeleteMapping("/{id}")  // DELETE /api/debts/{id}
    public ResponseEntity<Void> deleteDebt(@PathVariable Long id) {
        debtService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
