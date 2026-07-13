package com.pavel.rozpocetbackend.controller;

import com.pavel.rozpocetbackend.dto.IncomeDTO;
import com.pavel.rozpocetbackend.entity.Income;
import com.pavel.rozpocetbackend.mapper.IncomeMapper;
import com.pavel.rozpocetbackend.service.IncomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

/**
 * Třída IncomeController je zodpovědná za zpracování HTTP požadavků týkajících se příjmů.
 * Obsahuje metody pro získání všech příjmů, přidání nového příjmu, výpočet celkového
 * příjmu za rok a měsíční rozpad příjmů pro grafy.
 */

@RestController  // Označení třídy jako REST Controller
@RequestMapping("/api/incomes")  // Základní URL pro všechny endpointy v tomto controlleru
public class IncomeController {

    @Autowired  // Automatické injektování instance IncomeService
    private IncomeService incomeService;

    @GetMapping  // Endpoint pro získání všech příjmů
    public List<IncomeDTO> getAllIncomes() {
        return incomeService.getAllIncomes()  // Načte všechny příjmy z databáze
                .stream()
                .map(IncomeMapper::toDTO)  // Převede každý příjem na DTO
                .toList();
    }

    @PostMapping  // Endpoint pro vytvoření nového příjmu
    public IncomeDTO addIncome(@RequestBody IncomeDTO incomeDTO) {
        Income incomeEntity = IncomeMapper.toEntity(incomeDTO);  // Převod DTO na entitu
        Income savedIncome = incomeService.addIncome(incomeEntity);  // Uložení do databáze
        return IncomeMapper.toDTO(savedIncome);  // Vrácení uloženého příjmu jako DTO
    }

    /**
     * Vrátí celkovou sumu příjmů za konkrétní rok.
     */
    @GetMapping("/total/{year}")  // GET /api/incomes/total/{year}
    public Double getTotalIncomeForYear(@PathVariable int year) {
        return incomeService.getTotalIncomeForYear(year);
    }

    /**
     * Vrátí příjmy rozpadlé po jednotlivých měsících (1-12) pro daný rok - data pro sloupcový graf.
     */
    @GetMapping("/monthly/{year}")  // GET /api/incomes/monthly/{year}
    public Map<Integer, Double> getMonthlyIncomeForYear(@PathVariable int year) {
        return incomeService.getMonthlyIncomeForYear(year);
    }

    /**
     * Aktualizuje existující příjem podle ID.
     */
    @PutMapping("/{id}")  // PUT /api/incomes/{id}
    public IncomeDTO updateIncome(@PathVariable Long id, @RequestBody IncomeDTO incomeDTO) {
        Income incomeEntity = IncomeMapper.toEntity(incomeDTO);
        Income updated = incomeService.update(id, incomeEntity);
        return IncomeMapper.toDTO(updated);
    }

    /**
     * Smaže příjem podle ID.
     */
    @DeleteMapping("/{id}")  // DELETE /api/incomes/{id}
    public ResponseEntity<Void> deleteIncome(@PathVariable Long id) {
        incomeService.delete(id);
        return ResponseEntity.noContent().build();  // HTTP 204 - úspěšně smazáno, žádná data k vrácení
    }
}