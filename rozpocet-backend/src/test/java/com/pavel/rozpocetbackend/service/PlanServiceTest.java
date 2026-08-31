package com.pavel.rozpocetbackend.service;

import com.pavel.rozpocetbackend.entity.Plan;
import com.pavel.rozpocetbackend.repository.PlanRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

/**
 * Testy pro PlanService - ověřují porovnání naplánované částky se skutečnými výdaji
 * na úrovni skupiny (planGroup).
 */
@ExtendWith(MockitoExtension.class)  // Aktivuje Mockito framework pro tuhle testovací třídu
class PlanServiceTest {

    @Mock  // Vytvoří falešnou (mock) verzi repository - test se nepřipojuje ke skutečné databázi
    private PlanRepository planRepository;

    @Mock  // PlanService interně používá i ExpenseService, tak ho také mockujeme
    private ExpenseService expenseService;

    @InjectMocks  // Vytvoří skutečnou instanci Service a vloží do ní oba mocky výše
    private PlanService planService;

    /**
     * Ověřuje, že když appka nenajde žádné odpovídající výdaje pro danou skupinu,
     * "actual" bude 0 a appka to správně vrátí spolu s naplánovanou částkou a rozdílem.
     */
    @Test
    void comparePlanToActual_shouldReturnZeroActual_whenNoMatchingExpenses() {
        // Arrange - připravíme testovací plán na úrovni skupiny "Fixní náklady"
        Plan plan = new Plan();
        plan.setId(1L);
        plan.setPlanGroup("Fixní náklady");  // Dříve setCategory("Jídlo")
        plan.setPlannedAmount(7000.0);
        plan.setYear(2026);
        plan.setMonth(6);

        // Řekneme mocku, co má vrátit, když se zavolá findById(1L)
        when(planRepository.findById(1L)).thenReturn(Optional.of(plan));

        // Řekneme mocku, co má vrátit metoda na úrovni SKUPINY (ne kategorie)
        when(expenseService.getActualAmountForGroupAndMonth("Fixní náklady", 2026, 6))
                .thenReturn(0.0);

        // Act - zavoláme testovanou metodu
        Map<String, Double> result = planService.comparePlanToActual(1L);

        // Assert - ověříme, že appka vrátila správné hodnoty
        assertEquals(7000.0, result.get("planned"), 0.01);
        assertEquals(0.0, result.get("actual"), 0.01);
        assertEquals(7000.0, result.get("difference"), 0.01);
    }
}