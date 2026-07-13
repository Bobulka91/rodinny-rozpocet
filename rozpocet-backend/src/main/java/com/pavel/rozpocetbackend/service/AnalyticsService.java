package com.pavel.rozpocetbackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

/**
 * Service vrstva pro roční analytický přehled - kombinuje data z IncomeService
 * a ExpenseService, aby vrátila kompletní roční souhrn (příjmy, výdaje, bilance,
 * rozpad výdajů podle kategorie). Nemá vlastní Entity ani Repository.
 */

@Service
public class AnalyticsService {

    @Autowired  // Spring sem automaticky vloží instanci IncomeService
    private IncomeService incomeService;

    @Autowired  // Spring sem automaticky vloží instanci ExpenseService
    private ExpenseService expenseService;

    /**
     * Sestaví kompletní roční přehled pro daný rok - celkové příjmy, celkové výdaje,
     * bilanci (příjmy mínus výdaje) a rozpad výdajů podle kategorie.
     */

    public Map<String, Object> getYearlySummary(int year) {
        Double totalIncome = incomeService.getTotalIncomeForYear(year);  // Celkové příjmy za rok
        Double totalExpenses = expenseService.getTotalExpensesForYear(year);  // Celkové výdaje za rok
        Double balance = totalIncome - totalExpenses;  // Bilance = kolik zbylo

        Map<String, Object> summary = new HashMap<>();  // Object, protože kombinujeme různé typy dat
        summary.put("year", year);
        summary.put("totalIncome", totalIncome);
        summary.put("totalExpenses", totalExpenses);
        summary.put("balance", balance);
        summary.put("expenseByCategory", expenseService.getExpensesByCategoryForYear(year));  // Rozpad podle kategorie

        return summary;
    }
}