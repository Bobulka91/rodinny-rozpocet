package com.pavel.rozpocetbackend.controller;

import com.pavel.rozpocetbackend.dto.SavingGoalDTO;
import com.pavel.rozpocetbackend.entity.SavingGoal;
import com.pavel.rozpocetbackend.mapper.SavingGoalMapper;
import com.pavel.rozpocetbackend.service.SavingGoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Třída SavingGoalController je zodpovědná za zpracování HTTP požadavků týkajících se cílů spoření.
 * Obsahuje metody pro získání všech cílů, přidání nového cíle, získání procentuálního pokroku
 * konkrétního cíle a získání celkové cílové a aktuálně naspořené částky napříč všemi cíli.
 */

@RestController  // Označení třídy jako REST Controller
@RequestMapping("/api/saving-goals")  // Základní URL pro všechny endpointy v tomto controlleru
public class SavingGoalController {

    @Autowired  // Automatické injektování instance SavingGoalService
    private SavingGoalService savingGoalService;

    @GetMapping  // Endpoint pro získání všech cílů spoření
    public List<SavingGoalDTO> getAllSavingGoals() {
        return savingGoalService.getAllSavingGoals()  // Načte všechny cíle z databáze
                .stream()
                .map(SavingGoalMapper::toDTO)  // Převede každý cíl na DTO
                .toList();
    }

    @PostMapping  // Endpoint pro vytvoření nového cíle spoření
    public SavingGoalDTO addSavingGoal(@RequestBody SavingGoalDTO savingGoalDTO) {
        SavingGoal goalEntity = SavingGoalMapper.toEntity(savingGoalDTO);  // Převod DTO na entitu
        SavingGoal savedGoal = savingGoalService.addSavingGoal(goalEntity);  // Uložení do databáze
        return SavingGoalMapper.toDTO(savedGoal);  // Vrácení uloženého cíle jako DTO
    }

    /**
     * Vrátí procentuální pokrok konkrétního cíle spoření (kolik % už je naspořeno).
     */
    @GetMapping("/{id}/progress")  // GET /api/saving-goals/{id}/progress
    public Double getProgress(@PathVariable Long id) {
        return savingGoalService.getProgressPercentage(id);
    }

    /**
     * Vrátí součet cílových částek napříč všemi cíli (kolik chci celkem naspořit).
     */
    @GetMapping("/total-target")  // GET /api/saving-goals/total-target
    public Double getTotalTargetAmount() {
        return savingGoalService.getTotalTargetAmount();
    }

    /**
     * Vrátí součet aktuálně naspořených částek napříč všemi cíli.
     */
    @GetMapping("/total-current")  // GET /api/saving-goals/total-current
    public Double getTotalCurrentAmount() {
        return savingGoalService.getTotalCurrentAmount();
    }

    /**
     * Aktualizuje existující cíl spoření podle ID.
     */
    @PutMapping("/{id}")  // PUT /api/saving-goals/{id}
    public SavingGoalDTO updateSavingGoal(@PathVariable Long id, @RequestBody SavingGoalDTO savingGoalDTO) {
        SavingGoal goalEntity = SavingGoalMapper.toEntity(savingGoalDTO);
        SavingGoal updated = savingGoalService.update(id, goalEntity);
        return SavingGoalMapper.toDTO(updated);
    }

    /**
     * Smaže cíl spoření podle ID.
     */
    @DeleteMapping("/{id}")  // DELETE /api/saving-goals/{id}
    public ResponseEntity<Void> deleteSavingGoal(@PathVariable Long id) {
        savingGoalService.delete(id);
        return ResponseEntity.noContent().build();
    }
}