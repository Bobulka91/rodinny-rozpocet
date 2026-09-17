package com.pavel.rozpocetbackend.service;

import com.pavel.rozpocetbackend.entity.Plan;
import com.pavel.rozpocetbackend.repository.PlanRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service vrstva pro Plan - obsahuje business logiku pro rozpočtové plány,
 * včetně porovnání plánu se skutečnými výdaji na úrovni SKUPINY (využívá ExpenseService).
 */
@Service
public class PlanService {

    @Autowired  // Spring sem automaticky vloží instanci PlanRepository
    private PlanRepository planRepository;

    @Autowired  // Spring sem automaticky vloží instanci ExpenseService (Service v Service)
    private ExpenseService expenseService;

    /**
     * Uloží nový plán do databáze.
     */
    public Plan addPlan(Plan plan) {
        return planRepository.save(plan);
    }

    /**
     * Vrátí všechny plány z databáze.
     */
    public List<Plan> getAllPlans() {
        return planRepository.findAll();
    }

    /**
     * Porovná naplánovanou částku se skutečnými výdaji pro danou SKUPINU/rok/měsíc.
     * Vrací mapu s klíči "planned" (plán), "actual" (skutečnost), "difference" (rozdíl).
     */
    public Map<String, Double> comparePlanToActual(Long planId) {
        Plan plan = planRepository.findById(planId)
                .orElseThrow(() -> new IllegalArgumentException("Plan not found with id: " + planId));

        // OPRAVENO: použijeme metodu na úrovni SKUPINY (getActualAmountForGroupAndMonth),
        // ne starou metodu pro jednotlivou kategorii - jinak by "actual" vždy vyšlo 0,
        // protože planGroup ("Fixní náklady") se nikdy neshoduje s labelem kategorie ("Nájem")
        Double actual = expenseService.getActualAmountForGroupAndMonth(
                plan.getPlanGroup(), plan.getYear(), plan.getMonth());

        Map<String, Double> result = new HashMap<>();
        result.put("planned", plan.getPlannedAmount());
        result.put("actual", actual);
        result.put("difference", plan.getPlannedAmount() - actual);

        return result;
    }

    /**
     * Aktualizuje existující plán podle ID - přepíše všechna pole novými hodnotami z DTO.
     */
    public Plan update(Long id, Plan plan) {
        Plan existing = planRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Plán s ID " + id + " nenalezen"));
        existing.setPlanGroup(plan.getPlanGroup());          // Přepíšeme skupinu (např. "Fixní náklady")
        existing.setPlannedAmount(plan.getPlannedAmount());  // Přepíšeme naplánovanou částku
        existing.setYear(plan.getYear());                    // Přepíšeme rok platnosti
        existing.setMonth(plan.getMonth());                  // Přepíšeme měsíc platnosti
        return planRepository.save(existing);
    }

    /**
     * Smaže plán podle ID. Pokud neexistuje, vyhodí výjimku.
     */
    public void delete(Long id) {
        if (!planRepository.existsById(id)) {  // Nejdřív ověříme, že záznam vůbec existuje
            throw new EntityNotFoundException("Plán s ID " + id + " nenalezen");
        }
        planRepository.deleteById(id);
    }
}