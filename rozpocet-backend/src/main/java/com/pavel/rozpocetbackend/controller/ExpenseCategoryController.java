package com.pavel.rozpocetbackend.controller;

import com.pavel.rozpocetbackend.entity.ExpenseCategory;
import com.pavel.rozpocetbackend.service.ExpenseCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Třída ExpenseCategoryController je zodpovědná za zpracování HTTP požadavků
 * týkajících se trvalých kategorií výdajů (šablon).
 */
@RestController
@RequestMapping("/api/expense-categories")
public class ExpenseCategoryController {

    @Autowired  // Automatické injektování instance ExpenseCategoryService
    private ExpenseCategoryService expenseCategoryService;

    @GetMapping  // Endpoint pro získání všech kategorií výdajů
    public List<ExpenseCategory> getAllExpenseCategories() {
        return expenseCategoryService.getAllExpenseCategories();
    }

    @PostMapping  // Endpoint pro vytvoření nové kategorie výdaje
    public ExpenseCategory addExpenseCategory(@RequestBody ExpenseCategory expenseCategory) {
        return expenseCategoryService.addExpenseCategory(expenseCategory);
    }

    // Update existující kategorie výdaje.
    @PutMapping("/{id}")
    public ExpenseCategory updateExpenseCategory(@PathVariable Long id,
                                                 @RequestBody ExpenseCategory expenseCategory) {
        return expenseCategoryService.updateExpenseCategory(id, expenseCategory);
    }

    // Smazání kategorie výdaje podle ID.
    @DeleteMapping("/{id}")
    public void deleteExpenseCategory(@PathVariable Long id) {
        expenseCategoryService.deleteExpenseCategory(id);
    }
}