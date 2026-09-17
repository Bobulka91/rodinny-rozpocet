package com.pavel.rozpocetbackend.controller;

import com.pavel.rozpocetbackend.entity.ExpenseCategory;
import com.pavel.rozpocetbackend.service.ExpenseCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Třída ExpenseCategoryController je zodpovědná za zpracování HTTP požadavků
 * týkajících se trvalých kategorií výdajů (šablon). Obsahuje metody pro získání
 * všech kategorií, přidání nové, aktualizaci existující a smazání.
 */
@RestController  // Označení třídy jako REST Controller
@RequestMapping("/api/expense-categories")  // Základní URL pro všechny endpointy v tomto controlleru
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

    /**
     * Aktualizuje existující kategorii výdaje podle ID.
     */
    @PutMapping("/{id}")  // PUT /api/expense-categories/{id}
    public ExpenseCategory updateExpenseCategory(@PathVariable Long id, @RequestBody ExpenseCategory expenseCategory) {
        return expenseCategoryService.update(id, expenseCategory);
    }

    /**
     * Smaže kategorii výdaje podle ID.
     */
    @DeleteMapping("/{id}")  // DELETE /api/expense-categories/{id}
    public ResponseEntity<Void> deleteExpenseCategory(@PathVariable Long id) {
        expenseCategoryService.delete(id);
        return ResponseEntity.noContent().build();  // HTTP 204 - úspěšně smazáno, žádná data k vrácení
    }
}