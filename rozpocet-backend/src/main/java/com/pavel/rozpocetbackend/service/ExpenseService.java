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

    // Update existujícího výdaje podle ID.
    // Nejdřív ověříme, že výdaj i kategorie fakt existují (jinak IllegalArgumentException),
    // pak přepíšeme hodnoty a uložíme - save() na existující ID v JPA znamená update, ne insert.
    public Expense updateExpense(Long id, Expense updatedExpense, Long categoryId) {
        Expense existingExpense = expenseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Expense not found: " + id));

        ExpenseCategory category = expenseCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("ExpenseCategory not found: " + categoryId));

        existingExpense.setAmount(updatedExpense.getAmount());
        existingExpense.setDate(updatedExpense.getDate());
        existingExpense.setExpenseCategory(category);

        return expenseRepository.save(existingExpense);
    }

    // Smazání výdaje podle ID.
    // existsById() nejdřív ověří, že tam něco je - jinak by deleteById() na neexistujícím
    // ID v novějších verzích Spring Data JPA hodilo EmptyResultDataAccessException,
    // což je míň srozumitelná chyba než naše vlastní IllegalArgumentException.
    public void deleteExpense(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw new IllegalArgumentException("Expense not found: " + id);
        }
        expenseRepository.deleteById(id);
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
}