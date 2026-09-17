package com.pavel.rozpocetbackend.service;

import com.pavel.rozpocetbackend.entity.CategoryType;
import com.pavel.rozpocetbackend.entity.Expense;
import com.pavel.rozpocetbackend.entity.ExpenseCategory;
import com.pavel.rozpocetbackend.repository.ExpenseRepository;
import com.pavel.rozpocetbackend.repository.ExpenseCategoryRepository;
import jakarta.persistence.EntityNotFoundException;

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

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private ExpenseCategoryRepository expenseCategoryRepository;

    public Expense addExpense(Expense expense, Long categoryId) {
        ExpenseCategory category = expenseCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("ExpenseCategory not found: " + categoryId));
        expense.setExpenseCategory(category);
        return expenseRepository.save(expense);
    }

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    public Map<String, Double> getExpensesByCategory() {
        return expenseRepository.findAll()
                .stream()
                .filter(expense -> expense.getExpenseCategory() != null)
                .collect(Collectors.groupingBy(
                        expense -> expense.getExpenseCategory().getLabel(),
                        Collectors.summingDouble(Expense::getAmount)
                ));
    }

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

    public Double getTotalExpensesForYear(int year) {
        return expenseRepository.findAll()
                .stream()
                .filter(expense -> expense.getDate().getYear() == year)
                .mapToDouble(Expense::getAmount)
                .sum();
    }

    public Map<Integer, Double> getMonthlyExpensesForYear(int year) {
        return expenseRepository.findAll()
                .stream()
                .filter(expense -> expense.getDate().getYear() == year)
                .collect(Collectors.groupingBy(
                        expense -> expense.getDate().getMonthValue(),
                        Collectors.summingDouble(Expense::getAmount)
                ));
    }

    public void generateFixedExpensesForMonth(int year, int month) {

        List<ExpenseCategory> fixedCategories = expenseCategoryRepository.findAll()
                .stream()
                .filter(category -> category.getType() == CategoryType.FIXNI)
                .toList();

        for (ExpenseCategory category : fixedCategories) {

            boolean alreadyExists = expenseRepository.findAll().stream()
                    .anyMatch(expense ->
                            expense.getExpenseCategory() != null
                                    && expense.getExpenseCategory().getId().equals(category.getId())
                                    && expense.getDate().getYear() == year
                                    && expense.getDate().getMonthValue() == month
                    );

            if (!alreadyExists) {
                Expense newExpense = new Expense();
                newExpense.setAmount(category.getAmount());
                newExpense.setDate(LocalDate.of(year, month, 1));
                newExpense.setExpenseCategory(category);
                expenseRepository.save(newExpense);
            }
        }
    }

    public Map<String, Double> getExpensesByGroup() {
        return expenseRepository.findAll()
                .stream()
                .filter(expense -> expense.getExpenseCategory() != null)
                .collect(Collectors.groupingBy(
                        expense -> expense.getExpenseCategory().getCategoryGroup(),
                        Collectors.summingDouble(Expense::getAmount)
                ));
    }

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

    /**
     * Aktualizuje existující výdaj podle ID - přepíše částku, datum a případně kategorii.
     * categoryId přichází zvlášť (z Controlleru); pokud je null, kategorie výdaje
     * se nemění, jen se aktualizují amount a date.
     */
    public Expense update(Long id, Expense expense, Long categoryId) {
        Expense existing = expenseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Výdaj s ID " + id + " nenalezen"));

        existing.setAmount(expense.getAmount());
        existing.setDate(expense.getDate());

        if (categoryId != null) {  // Kategorii měníme, jen když appka dostala nové categoryId
            ExpenseCategory category = expenseCategoryRepository.findById(categoryId)
                    .orElseThrow(() -> new IllegalArgumentException("ExpenseCategory not found: " + categoryId));
            existing.setExpenseCategory(category);
        }

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