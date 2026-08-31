package com.pavel.rozpocetbackend.controller;

import com.pavel.rozpocetbackend.dto.MonthlyBalanceDTO;
import com.pavel.rozpocetbackend.entity.MonthlyBalance;
import com.pavel.rozpocetbackend.mapper.MonthlyBalanceMapper;
import com.pavel.rozpocetbackend.service.MonthlyBalanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Třída MonthlyBalanceController je zodpovědná za zpracování HTTP požadavků
 * týkajících se měsíčních zůstatků a jejich přenosu mezi měsíci.
 */
@RestController  // Označení třídy jako REST Controller
@RequestMapping("/api/monthly-balance")  // Základní URL pro všechny endpointy v tomto controlleru
public class MonthlyBalanceController {

    @Autowired  // Automatické injektování instance MonthlyBalanceService
    private MonthlyBalanceService monthlyBalanceService;

    /**
     * Vrátí historii všech uložených měsíčních zůstatků - třeba pro zobrazení
     * "Květen: 560 Kč, Červen: 3000 Kč..." za posledních X měsíců.
     */
    @GetMapping  // GET /api/monthly-balance
    public List<MonthlyBalanceDTO> getAllBalances() {
        return monthlyBalanceService.getAllBalances()
                .stream()
                .map(MonthlyBalanceMapper::toDTO)
                .toList();
    }

    /**
     * Spočítá a uloží zůstatek pro daný měsíc/rok. Frontend tohle zavolá
     * typicky na konci měsíce nebo při otevření appky v novém měsíci.
     */
    @PostMapping("/calculate/{year}/{month}")  // POST /api/monthly-balance/calculate/2026/8
    public MonthlyBalanceDTO calculateBalance(@PathVariable int year, @PathVariable int month) {
        MonthlyBalance balance = monthlyBalanceService.calculateAndSaveBalance(year, month);
        return MonthlyBalanceMapper.toDTO(balance);
    }
}