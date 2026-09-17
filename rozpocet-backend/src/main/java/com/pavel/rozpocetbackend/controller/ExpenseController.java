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
 * Obsahuje metody pro získání všech výdajů, přidání nového výdaje, aktualizaci a smazání
 * existujícího výdaje, agregace podle kategorie i skupiny (pro grafy), měsíční rozpad,
 * celkovou sumu za rok a automatické generování fixních výdajů pro nový měsíc.
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

    /**
     * Vrátí sumu výdajů seskupenou podle kategorie (přes všechny roky) - data pro pie chart.
     */
    @GetMapping("/by-category")
    public Map<String, Double> getExpensesByCategory() {
        return expenseService.getExpensesByCategory();
    }

    /**
     * Vrátí sumu výdajů seskupenou podle kategorie pro konkrétní rok.
     */
    @GetMapping("/by-category/{year}")
    public Map<String, Double> getExpensesByCategoryForYear(@PathVariable int year) {
        return expenseService.getExpensesByCategoryForYear(year);
    }

    /**
     * Vrátí celkovou sumu výdajů za konkrétní rok.
     */
    @GetMapping("/total/{year}")
    public Double getTotalExpensesForYear(@PathVariable int year) {
        return expenseService.getTotalExpensesForYear(year);
    }

    /**
     * Vrátí výdaje rozpadlé po jednotlivých měsících (1-12) pro daný rok - data pro sloupcový graf.
     */
    @GetMapping("/monthly/{year}")
    public Map<Integer, Double> getMonthlyExpensesForYear(@PathVariable int year) {
        return expenseService.getMonthlyExpensesForYear(year);
    }

    /**
     * Vygeneruje fixní výdaje (nájem, předplatné...) pro daný měsíc a rok,
     * pokud tam ještě neexistují. Frontend tohle zavolá typicky při otevření
     * appky v novém měsíci, aby uživatel nemusel fixní položky zadávat ručně.
     */
    @PostMapping("/generate-fixed/{year}/{month}")
    public void generateFixedExpenses(@PathVariable int year, @PathVariable int month) {
        expenseService.generateFixedExpensesForMonth(year, month);
    }

    /**
     * Vrátí sumu výdajů seskupenou podle skupiny (Fixní náklady, Předplatné...) -
     * data pro souhrnné částky na Slide 1/3/4.
     */
    @GetMapping("/by-group")
    public Map<String, Double> getExpensesByGroup() {
        return expenseService.getExpensesByGroup();
    }

    /**
     * Aktualizuje existující výdaj podle ID.
     * categoryId appka očekává jako URL parametr (nepovinný): PUT /api/expenses/{id}?categoryId=1
     * Pokud categoryId chybí, kategorie výdaje zůstane beze změny.
     */
    @PutMapping("/{id}")
    public ExpenseDTO updateExpense(@PathVariable Long id, @RequestBody ExpenseDTO expenseDTO,
                                    @RequestParam(required = false) Long categoryId) {
        Expense expenseEntity = ExpenseMapper.toEntity(expenseDTO);
        Expense updated = expenseService.update(id, expenseEntity, categoryId);
        return ExpenseMapper.toDTO(updated);
    }

    /**
     * Smaže výdaj podle ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        expenseService.delete(id);
        return ResponseEntity.noContent().build();
    }
}