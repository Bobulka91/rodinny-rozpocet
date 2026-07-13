package com.pavel.rozpocetbackend.controller;

import com.pavel.rozpocetbackend.dto.ExpenseDTO;
import com.pavel.rozpocetbackend.entity.Expense;
import com.pavel.rozpocetbackend.mapper.ExpenseMapper;
import com.pavel.rozpocetbackend.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

/**
 * Třída ExpenseController je zodpovědná za zpracování HTTP požadavků týkajících se výdajů.
 * Obsahuje metody pro získání všech výdajů, přidání nového výdaje, agregace podle
 * kategorie (pro pie chart), měsíční rozpad a celkovou sumu za rok.
 */

@RestController  // Označení třídy jako REST Controller
@RequestMapping("/api/expenses")  // Základní URL pro všechny endpointy v tomto controlleru
public class ExpenseController {

    @Autowired  // Automatické injektování instance ExpenseService
    private ExpenseService expenseService;

    @GetMapping  // Endpoint pro získání všech výdajů
    public List<ExpenseDTO> getAllExpenses() {
        return expenseService.getAllExpenses()  // Načte všechny výdaje z databáze
                .stream()
                .map(ExpenseMapper::toDTO)  // Převede každý výdaj na DTO
                .toList();
    }

    @PostMapping  // Endpoint pro vytvoření nového výdaje
    public ExpenseDTO addExpense(@RequestBody ExpenseDTO expenseDTO) {
        Expense expenseEntity = ExpenseMapper.toEntity(expenseDTO);  // Převod DTO na entitu
        Expense savedExpense = expenseService.addExpense(expenseEntity);  // Uložení do databáze
        return ExpenseMapper.toDTO(savedExpense);  // Vrácení uloženého výdaje jako DTO
    }

    /**
     * Vrátí sumu výdajů seskupenou podle kategorie (přes všechny roky) - data pro pie chart.
     */

    @GetMapping("/by-category")  // GET /api/expenses/by-category
    public Map<String, Double> getExpensesByCategory() {
        return expenseService.getExpensesByCategory();
    }

    /**
     * Vrátí sumu výdajů seskupenou podle kategorie pro konkrétní rok.
     */

    @GetMapping("/by-category/{year}")  // GET /api/expenses/by-category/{year}
    public Map<String, Double> getExpensesByCategoryForYear(@PathVariable int year) {
        return expenseService.getExpensesByCategoryForYear(year);
    }

    /**
     * Vrátí celkovou sumu výdajů za konkrétní rok.
     */

    @GetMapping("/total/{year}")  // GET /api/expenses/total/{year}
    public Double getTotalExpensesForYear(@PathVariable int year) {
        return expenseService.getTotalExpensesForYear(year);
    }

    /**
     * Vrátí výdaje rozpadlé po jednotlivých měsících (1-12) pro daný rok - data pro sloupcový graf.
     */

    @GetMapping("/monthly/{year}")  // GET /api/expenses/monthly/{year}
    public Map<Integer, Double> getMonthlyExpensesForYear(@PathVariable int year) {
        return expenseService.getMonthlyExpensesForYear(year);
    }

    /**
     * Aktualizuje existující výdaj podle ID.
     */
    @PutMapping("/{id}")  // PUT /api/expenses/{id}
    public ExpenseDTO updateExpense(@PathVariable Long id, @RequestBody ExpenseDTO expenseDTO) {
        Expense expenseEntity = ExpenseMapper.toEntity(expenseDTO);
        Expense updated = expenseService.update(id, expenseEntity);
        return ExpenseMapper.toDTO(updated);
    }

    /**
     * Smaže výdaj podle ID.
     */
    @DeleteMapping("/{id}")  // DELETE /api/expenses/{id}
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        expenseService.delete(id);
        return ResponseEntity.noContent().build();
    }
}