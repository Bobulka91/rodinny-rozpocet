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
 * Testy pro PlanService - ověřují porovnání naplánované částky se skutečnými výdaji.
 */
@ExtendWith(MockitoExtension.class)
class PlanServiceTest {

    @Mock
    private PlanRepository planRepository;

    @Mock  // PlanService interně používá i ExpenseService, tak ho také mockujeme
    private ExpenseService expenseService;

    @InjectMocks
    private PlanService planService;

    /**
     * Ověřuje, že když appka nenajde žádné odpovídající výdaje, "actual" bude 0
     * a appka to správně vrátí spolu s naplánovanou částkou a rozdílem.
     */
    @Test
    void comparePlanToActual_shouldReturnZeroActual_whenNoMatchingExpenses() {
        // Arrange
        Plan plan = new Plan();
        plan.setId(1L);
        plan.setCategory("Jídlo");
        plan.setPlannedAmount(7000.0);
        plan.setYear(2026);
        plan.setMonth(6);

        when(planRepository.findById(1L)).thenReturn(Optional.of(plan));
        when(expenseService.getActualAmountForCategoryAndMonth("Jídlo", 2026, 6))
                .thenReturn(0.0);

        // Act
        Map<String, Double> result = planService.comparePlanToActual(1L);

        // Assert
        assertEquals(7000.0, result.get("planned"), 0.01);
        assertEquals(0.0, result.get("actual"), 0.01);
        assertEquals(7000.0, result.get("difference"), 0.01);
    }
}
