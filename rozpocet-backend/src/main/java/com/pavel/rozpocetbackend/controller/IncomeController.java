package com.pavel.rozpocetbackend.controller;

import com.pavel.rozpocetbackend.dto.IncomeDTO;
import com.pavel.rozpocetbackend.entity.Income;
import com.pavel.rozpocetbackend.mapper.IncomeMapper;
import com.pavel.rozpocetbackend.service.IncomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Třída IncomeController je zodpovědná za zpracování HTTP požadavků týkajících se příjmů.
 * Obsahuje metody pro získání všech příjmů, přidání nového příjmu, výpočet celkového
 * příjmu za rok, měsíční rozpad příjmů pro grafy a agregaci podle osoby.
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

    /**
     * Endpoint pro vytvoření nového příjmu.
     * sourceId appka očekává jako URL parametr: POST /api/incomes?sourceId=1
     */
    @PostMapping
    public IncomeDTO addIncome(@RequestBody IncomeDTO incomeDTO, @RequestParam Long sourceId) {
        Income incomeEntity = IncomeMapper.toEntity(incomeDTO);  // Převod DTO na entitu
        Income savedIncome = incomeService.addIncome(incomeEntity, sourceId);  // Uložení do databáze s přiřazeným zdrojem
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
     * Vrátí sumu příjmů seskupenou podle osoby (Já, Manželka...) - data pro Slide 2.
     */
    @GetMapping("/by-person")  // GET /api/incomes/by-person
    public Map<String, Double> getIncomeByPerson() {
        return incomeService.getIncomeByPerson();
    }
}