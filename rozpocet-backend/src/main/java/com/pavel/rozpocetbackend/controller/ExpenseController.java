package com.pavel.rozpocetbackend.controller;

import com.pavel.rozpocetbackend.dto.ExpenseDTO;
import com.pavel.rozpocetbackend.entity.Expense;
import com.pavel.rozpocetbackend.mapper.ExpenseMapper;
import com.pavel.rozpocetbackend.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Třída ExpenseController je zodpovědná za zpracování HTTP požadavků týkajících se výdajů.
 * Obsahuje metody pro získání všech výdajů, přidání nového výdaje, úpravu a smazání výdaje,
 * agregace podle kategorie i skupiny (pro grafy), měsíční rozpad, celkovou sumu za rok a
 * automatické generování fixních výdajů pro nový měsíc.
 */
@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @GetMapping
    public List<ExpenseDTO> getAllExpenses() {
        return expenseService.getAllExpenses()
                .stream()
                .map(ExpenseMapper::toDTO)
                .toList();
    }

    @PostMapping
    public ExpenseDTO addExpense(@RequestBody ExpenseDTO expenseDTO, @RequestParam Long categoryId) {
        Expense expenseEntity = ExpenseMapper.toEntity(expenseDTO);
        Expense savedExpense = expenseService.addExpense(expenseEntity, categoryId);
        return ExpenseMapper.toDTO(savedExpense);
    }

    // Update existujícího výdaje. ID jde v URL (/api/expenses/5), nové hodnoty
    // v těle požadavku, categoryId jako query parametr - stejný vzor jako u addExpense.
    @PutMapping("/{id}")
    public ExpenseDTO updateExpense(@PathVariable Long id,
                                    @RequestBody ExpenseDTO expenseDTO,
                                    @RequestParam Long categoryId) {
        Expense expenseEntity = ExpenseMapper.toEntity(expenseDTO);
        Expense updatedExpense = expenseService.updateExpense(id, expenseEntity, categoryId);
        return ExpenseMapper.toDTO(updatedExpense);
    }

    // Smazání výdaje podle ID.
    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
    }

    @GetMapping("/by-category")
    public Map<String, Double> getExpensesByCategory() {
        return expenseService.getExpensesByCategory();
    }

    @GetMapping("/by-category/{year}")
    public Map<String, Double> getExpensesByCategoryForYear(@PathVariable int year) {
        return expenseService.getExpensesByCategoryForYear(year);
    }

    @GetMapping("/total/{year}")
    public Double getTotalExpensesForYear(@PathVariable int year) {
        return expenseService.getTotalExpensesForYear(year);
    }

    @GetMapping("/monthly/{year}")
    public Map<Integer, Double> getMonthlyExpensesForYear(@PathVariable int year) {
        return expenseService.getMonthlyExpensesForYear(year);
    }

    @PostMapping("/generate-fixed/{year}/{month}")
    public void generateFixedExpenses(@PathVariable int year, @PathVariable int month) {
        expenseService.generateFixedExpensesForMonth(year, month);
    }

    @GetMapping("/by-group")
    public Map<String, Double> getExpensesByGroup() {
        return expenseService.getExpensesByGroup();
    }
}