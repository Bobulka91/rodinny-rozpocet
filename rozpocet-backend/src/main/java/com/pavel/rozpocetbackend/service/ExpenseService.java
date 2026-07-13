package com.pavel.rozpocetbackend.service;

import com.pavel.rozpocetbackend.entity.Expense;
import com.pavel.rozpocetbackend.repository.ExpenseRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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

    /**
     * Uloží nový výdaj do databáze.
     */

    public Expense addExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    /**
     * Vrátí všechny výdaje z databáze.
     */

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    /**
     * Seskupí všechny výdaje podle kategorie a sečte částky v každé skupině.
     * Používá se pro pie chart.
     */

    public Map<String, Double> getExpensesByCategory() {
        return expenseRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(
                        Expense::getCategory,
                        Collectors.summingDouble(Expense::getAmount)
                ));
    }

    /**
     * Vrátí součet výdajů pro konkrétní kategorii a konkrétní měsíc/rok.
     * Používá se pro porovnání plánu se skutečností.
     */

    public Double getActualAmountForCategoryAndMonth(String category, int year, int month) {
        return expenseRepository.findAll()
                .stream()
                .filter(expense -> expense.getCategory().equals(category))
                .filter(expense -> expense.getDate().getYear() == year)
                .filter(expense -> expense.getDate().getMonthValue() == month)
                .mapToDouble(Expense::getAmount)
                .sum();
    }

    /**
     * Seskupí výdaje podle kategorie, ale jen pro konkrétní rok.
     */

    public Map<String, Double> getExpensesByCategoryForYear(int year) {
        return expenseRepository.findAll()
                .stream()
                .filter(expense -> expense.getDate().getYear() == year)
                .collect(Collectors.groupingBy(
                        Expense::getCategory,
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
     * Aktualizuje existující výdaj podle ID - přepíše všechna pole novými hodnotami z DTO.
     */
    public Expense update(Long id, Expense expense) {
        Expense existing = expenseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Výdaj s ID " + id + " nenalezen"));
        existing.setAmount(expense.getAmount());
        existing.setDate(expense.getDate());
        existing.setCategory(expense.getCategory());
        return expenseRepository.save(existing);
    }

    /**
     * Smaže výdaj podle ID. Pokud neexistuje, vyhodí výjimku.
     */
    public void delete(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw new EntityNotFoundException("Výdaj s ID " + id + " nenalezen");
        }
        expenseRepository.deleteById(id);
    }
}