package com.pavel.rozpocetbackend.service;

import com.pavel.rozpocetbackend.entity.Expense;
import com.pavel.rozpocetbackend.repository.ExpenseRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

/**
 * Testy pro ExpenseService - ověřují agregační logiku (seskupování a sčítání výdajů).
 */
@ExtendWith(MockitoExtension.class)
class ExpenseServiceTest {

    @Mock
    private ExpenseRepository expenseRepository;

    @InjectMocks
    private ExpenseService expenseService;

    /**
     * Ověřuje, že se výdaje správně seskupí podle kategorie a sečtou.
     */
    @Test
    void getExpensesByCategory_shouldGroupAndSumCorrectly() {
        // Arrange - dva výdaje v kategorii "Jídlo", jeden v "Nájem"
        Expense e1 = new Expense(1L, 1000.0, LocalDate.of(2026, 6, 1), "Jídlo");
        Expense e2 = new Expense(2L, 500.0, LocalDate.of(2026, 6, 15), "Jídlo");
        Expense e3 = new Expense(3L, 12000.0, LocalDate.of(2026, 6, 1), "Nájem");

        when(expenseRepository.findAll()).thenReturn(List.of(e1, e2, e3));

        // Act
        Map<String, Double> result = expenseService.getExpensesByCategory();

        // Assert - Jídlo by mělo být 1500 (1000+500), Nájem 12000
        assertEquals(1500.0, result.get("Jídlo"), 0.01);
        assertEquals(12000.0, result.get("Nájem"), 0.01);
    }

    /**
     * Ověřuje, že se celková suma výdajů za daný rok spočítá správně a výdaje z jiného roku se ignorují.
     */
    @Test
    void getTotalExpensesForYear_shouldSumOnlyMatchingYear() {
        // Arrange - jeden výdaj v roce 2026, jeden v roce 2025 (nemá se počítat)
        Expense e1 = new Expense(1L, 1000.0, LocalDate.of(2026, 6, 1), "Jídlo");
        Expense e2 = new Expense(2L, 5000.0, LocalDate.of(2025, 3, 1), "Nájem");

        when(expenseRepository.findAll()).thenReturn(List.of(e1, e2));

        // Act
        Double result = expenseService.getTotalExpensesForYear(2026);

        // Assert - má se sečíst jen výdaj z roku 2026
        assertEquals(1000.0, result, 0.01);
    }
}