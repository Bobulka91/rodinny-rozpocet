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
 * Obsahuje metody pro získání všech výdajů, přidání nového výdaje, agregace podle
 * kategorie i skupiny (pro grafy), měsíční rozpad, celkovou sumu za rok a automatické
 * generování fixních výdajů pro nový měsíc.
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

    /**
     * Endpoint pro vytvoření nového výdaje.
     * categoryId appka očekává jako URL parametr: POST /api/expenses?categoryId=1
     */
    @PostMapping
    public ExpenseDTO addExpense(@RequestBody ExpenseDTO expenseDTO, @RequestParam Long categoryId) {
        Expense expenseEntity = ExpenseMapper.toEntity(expenseDTO);  // Převod DTO na entitu
        Expense savedExpense = expenseService.addExpense(expenseEntity, categoryId);  // Uložení do databáze s přiřazenou kategorií
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
     * Vygeneruje fixní výdaje (nájem, předplatné...) pro daný měsíc a rok,
     * pokud tam ještě neexistují. Frontend tohle zavolá typicky při otevření
     * appky v novém měsíci, aby uživatel nemusel fixní položky zadávat ručně.
     */
    @PostMapping("/generate-fixed/{year}/{month}")  // POST /api/expenses/generate-fixed/2026/8
    public void generateFixedExpenses(@PathVariable int year, @PathVariable int month) {
        expenseService.generateFixedExpensesForMonth(year, month);
    }

    /**
     * Vrátí sumu výdajů seskupenou podle skupiny (Fixní náklady, Předplatné...) -
     * data pro souhrnné částky na Slide 1/3/4.
     */
    @GetMapping("/by-group")  // GET /api/expenses/by-group
    public Map<String, Double> getExpensesByGroup() {
        return expenseService.getExpensesByGroup();
    }
}