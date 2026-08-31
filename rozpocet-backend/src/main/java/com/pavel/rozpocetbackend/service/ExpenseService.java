package com.pavel.rozpocetbackend.service;

import com.pavel.rozpocetbackend.entity.CategoryType;
import com.pavel.rozpocetbackend.entity.Expense;
import com.pavel.rozpocetbackend.entity.ExpenseCategory;
import com.pavel.rozpocetbackend.repository.ExpenseRepository;
import com.pavel.rozpocetbackend.repository.ExpenseCategoryRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service vrstva pro Expense - obsahuje business logiku (ukládání, agregace, výpočty).
 */
@Service
public class ExpenseService {

    @Autowired  // Spring sem automaticky vloží instanci ExpenseRepository
    private ExpenseRepository expenseRepository;

    @Autowired  // Spring sem automaticky vloží instanci ExpenseCategoryRepository
    private ExpenseCategoryRepository expenseCategoryRepository;

    /**
     * Uloží nový výdaj do databáze. categoryId přichází zvlášť (z Controlleru),
     * appka najde existující ExpenseCategory podle ID a přiřadí ji výdaji.
     */
    public Expense addExpense(Expense expense, Long categoryId) {
        ExpenseCategory category = expenseCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("ExpenseCategory not found: " + categoryId));
        expense.setExpenseCategory(category);
        return expenseRepository.save(expense);
    }

    /**
     * Vrátí všechny výdaje z databáze.
     */
    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    /**
     * Seskupí všechny výdaje podle labelu kategorie a sečte částky v každé skupině.
     * Používá se pro pie chart. Výdaje bez přiřazené kategorie se přeskočí.
     */
    public Map<String, Double> getExpensesByCategory() {
        return expenseRepository.findAll()
                .stream()
                .filter(expense -> expense.getExpenseCategory() != null)  // Přeskočíme výdaje bez kategorie
                .collect(Collectors.groupingBy(
                        expense -> expense.getExpenseCategory().getLabel(),  // Klíčem je teď label kategorie
                        Collectors.summingDouble(Expense::getAmount)
                ));
    }

    /**
     * Vrátí součet výdajů pro konkrétní kategorii (podle labelu) a konkrétní měsíc/rok.
     * Používá se pro porovnání plánu se skutečností.
     */
    public Double getActualAmountForCategoryAndMonth(String categoryLabel, int year, int month) {
        return expenseRepository.findAll()
                .stream()
                .filter(expense -> expense.getExpenseCategory() != null)
                .filter(expense -> expense.getExpenseCategory().getLabel().equals(categoryLabel))
                .filter(expense -> expense.getDate().getYear() == year)
                .filter(expense -> expense.getDate().getMonthValue() == month)
                .mapToDouble(Expense::getAmount)
                .sum();
    }

    /**
     * Seskupí výdaje podle labelu kategorie, ale jen pro konkrétní rok.
     */
    public Map<String, Double> getExpensesByCategoryForYear(int year) {
        return expenseRepository.findAll()
                .stream()
                .filter(expense -> expense.getExpenseCategory() != null)
                .filter(expense -> expense.getDate().getYear() == year)
                .collect(Collectors.groupingBy(
                        expense -> expense.getExpenseCategory().getLabel(),
                        Collectors.summingDouble(Expense::getAmount)
                ));
    }

    /**
     * Sečte všechny výdaje za konkrétní rok (jedno celkové číslo).
     */
    public Double getTotalExpensesForYear(int year) {
        return expenseRepository.findAll()
                .stream()
                .filter(expense -> expense.getDate().getYear() == year)
                .mapToDouble(Expense::getAmount)
                .sum();
    }

    /**
     * Seskupí výdaje podle měsíce (1-12) pro daný rok - data pro sloupcový graf.
     */
    public Map<Integer, Double> getMonthlyExpensesForYear(int year) {
        return expenseRepository.findAll()
                .stream()
                .filter(expense -> expense.getDate().getYear() == year)
                .collect(Collectors.groupingBy(
                        expense -> expense.getDate().getMonthValue(),
                        Collectors.summingDouble(Expense::getAmount)
                ));
    }

    /**
     * Automaticky vygeneruje výdaje pro fixní kategorie (FIXNI) v daném měsíci/roce,
     * pokud tam ještě neexistují. Díky tomu uživatel nemusí každý měsíc ručně zadávat
     * pořád stejné položky jako nájem nebo předplatné - appka to udělá za něj.
     */
    public void generateFixedExpensesForMonth(int year, int month) {

        // Krok 1: Najdeme všechny kategorie, které jsou typu FIXNI (ne PROMENLIVA)
        List<ExpenseCategory> fixedCategories = expenseCategoryRepository.findAll()
                .stream()
                .filter(category -> category.getType() == CategoryType.FIXNI)
                .toList();

        // Krok 2: Pro každou fixní kategorii zvlášť zkontrolujeme, jestli už výdaj
        // pro tenhle konkrétní měsíc/rok neexistuje
        for (ExpenseCategory category : fixedCategories) {

            boolean alreadyExists = expenseRepository.findAll().stream()
                    .anyMatch(expense ->
                            expense.getExpenseCategory() != null
                                    // Musí to být výdaj patřící PRÁVĚ téhle kategorii (porovnáváme ID)
                                    && expense.getExpenseCategory().getId().equals(category.getId())
                                    // A musí být ze stejného roku
                                    && expense.getDate().getYear() == year
                                    // A ze stejného měsíce
                                    && expense.getDate().getMonthValue() == month
                    );

            // Krok 3: Pokud výdaj pro tenhle měsíc ještě neexistuje, appka ho sama vytvoří
            if (!alreadyExists) {
                Expense newExpense = new Expense();
                newExpense.setAmount(category.getAmount());       // Částka se vezme přímo ze šablony kategorie
                newExpense.setDate(LocalDate.of(year, month, 1)); // Appka datuje výdaj na 1. den daného měsíce
                newExpense.setExpenseCategory(category);          // Přiřadíme výdaj k jeho kategorii
                expenseRepository.save(newExpense);                // A uložíme do databáze
            }
        }
    }

    /**
     * Seskupí všechny výdaje podle skupiny (categoryGroup z ExpenseCategory) a sečte částky.
     * Skupina je např. "Fixní náklady", "Předplatné", "Každodenní výdaje" - na rozdíl
     * od getExpensesByCategory() tady nejde o konkrétní položku (Nájem, Kafe...),
     * ale o celou nadřazenou kategorii. Používá se pro souhrnné částky na Slide 1/3/4.
     */
    public Map<String, Double> getExpensesByGroup() {
        return expenseRepository.findAll()
                .stream()
                .filter(expense -> expense.getExpenseCategory() != null)  // Přeskočíme výdaje bez kategorie
                .collect(Collectors.groupingBy(
                        expense -> expense.getExpenseCategory().getCategoryGroup(),  // Klíčem je teď skupina, ne label
                        Collectors.summingDouble(Expense::getAmount)
                ));
    }

    /**
     * Vrátí součet výdajů pro konkrétní SKUPINU kategorií (podle categoryGroup) a konkrétní měsíc/rok.
     * Na rozdíl od getActualAmountForCategoryAndMonth() nefiltruje podle jednotlivé kategorie
     * (např. "Nájem"), ale podle celé nadřazené skupiny (např. "Fixní náklady").
     * Používá se pro porovnání plánu se skutečností na úrovni skupiny.
     */
    public Double getActualAmountForGroupAndMonth(String group, int year, int month) {
        return expenseRepository.findAll()
                .stream()
                .filter(expense -> expense.getExpenseCategory() != null)
                .filter(expense -> expense.getExpenseCategory().getCategoryGroup().equals(group))
                .filter(expense -> expense.getDate().getYear() == year)
                .filter(expense -> expense.getDate().getMonthValue() == month)
                .mapToDouble(Expense::getAmount)
                .sum();
    }
}