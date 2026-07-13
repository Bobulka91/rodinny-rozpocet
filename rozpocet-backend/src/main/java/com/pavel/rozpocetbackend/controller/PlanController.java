package com.pavel.rozpocetbackend.controller;

import com.pavel.rozpocetbackend.dto.PlanDTO;
import com.pavel.rozpocetbackend.entity.Plan;
import com.pavel.rozpocetbackend.mapper.PlanMapper;
import com.pavel.rozpocetbackend.service.PlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

/**
 * Třída PlanController je zodpovědná za zpracování HTTP požadavků týkajících se rozpočtových plánů.
 * Obsahuje metody pro získání všech plánů, přidání nového plánu a porovnání
 * naplánované částky se skutečnými výdaji.
 */

@RestController  // Označení třídy jako REST Controller
@RequestMapping("/api/plans")  // Základní URL pro všechny endpointy v tomto controlleru
public class PlanController {

    @Autowired  // Automatické injektování instance PlanService
    private PlanService planService;

    @GetMapping  // Endpoint pro získání všech plánů
    public List<PlanDTO> getAllPlans() {
        return planService.getAllPlans()  // Načte všechny plány z databáze
                .stream()
                .map(PlanMapper::toDTO)  // Převede každý plán na DTO
                .toList();
    }

    @PostMapping  // Endpoint pro vytvoření nového plánu
    public PlanDTO addPlan(@RequestBody PlanDTO planDTO) {
        Plan planEntity = PlanMapper.toEntity(planDTO);  // Převod DTO na entitu
        Plan savedPlan = planService.addPlan(planEntity);  // Uložení do databáze
        return PlanMapper.toDTO(savedPlan);  // Vrácení uloženého plánu jako DTO
    }

    /**
     * Porovná naplánovanou částku se skutečnými výdaji pro danou kategorii/rok/měsíc.
     * Vrací mapu s klíči "planned", "actual" a "difference".
     */

    @GetMapping("/{planId}/compare")  // GET /api/plans/{planId}/compare
    public Map<String, Double> comparePlanToActual(@PathVariable Long planId) {
        return planService.comparePlanToActual(planId);
    }

    /**
     * Aktualizuje existující plán podle ID.
     */
    @PutMapping("/{id}")  // PUT /api/plans/{id}
    public PlanDTO updatePlan(@PathVariable Long id, @RequestBody PlanDTO planDTO) {
        Plan planEntity = PlanMapper.toEntity(planDTO);
        Plan updated = planService.update(id, planEntity);
        return PlanMapper.toDTO(updated);
    }

    /**
     * Smaže plán podle ID.
     */
    @DeleteMapping("/{id}")  // DELETE /api/plans/{id}
    public ResponseEntity<Void> deletePlan(@PathVariable Long id) {
        planService.delete(id);
        return ResponseEntity.noContent().build();
    }
}