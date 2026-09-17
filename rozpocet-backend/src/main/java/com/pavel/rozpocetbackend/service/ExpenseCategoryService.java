package com.pavel.rozpocetbackend.service;

import com.pavel.rozpocetbackend.entity.ExpenseCategory;
import com.pavel.rozpocetbackend.repository.ExpenseCategoryRepository;
import com.pavel.rozpocetbackend.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service vrstva pro ExpenseCategory - obsahuje business logiku pro trvalé kategorie výdajů.
 */
@Service
public class ExpenseCategoryService {

    @Autowired  // Spring sem automaticky vloží instanci ExpenseCategoryRepository
    private ExpenseCategoryRepository expenseCategoryRepository;

    @Autowired  // Potřebujeme pro kontrolu, jestli kategorii ještě někdo používá (viz deleteExpenseCategory)
    private ExpenseRepository expenseRepository;

    /**
     * Uloží novou kategorii výdaje do databáze.
     */
    public ExpenseCategory addExpenseCategory(ExpenseCategory expenseCategory) {
        return expenseCategoryRepository.save(expenseCategory);
    }

    // Update existující kategorie podle ID.
    public ExpenseCategory updateExpenseCategory(Long id, ExpenseCategory updatedCategory) {
        ExpenseCategory existing = expenseCategoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("ExpenseCategory not found: " + id));

        existing.setCategoryGroup(updatedCategory.getCategoryGroup());
        existing.setLabel(updatedCategory.getLabel());
        existing.setType(updatedCategory.getType());
        existing.setAmount(updatedCategory.getAmount());

        return expenseCategoryRepository.save(existing);
    }

    // Smazání kategorie podle ID - s ochranou proti smazání kategorie,
    // která je ještě navázaná na existující výdaje (jinak by ty výdaje zůstaly "osiřelé").
    public void deleteExpenseCategory(Long id) {
        if (!expenseCategoryRepository.existsById(id)) {
            throw new IllegalArgumentException("ExpenseCategory not found: " + id);
        }

        boolean isInUse = expenseRepository.findAll().stream()
                .anyMatch(expense -> expense.getExpenseCategory() != null
                        && expense.getExpenseCategory().getId().equals(id));

        if (isInUse) {
            throw new IllegalStateException(
                    "Kategorii nelze smazat - existují na ni navázané výdaje.");
        }

        expenseCategoryRepository.deleteById(id);
    }

    /**
     * Vrátí všechny kategorie výdajů z databáze.
     */
    public List<ExpenseCategory> getAllExpenseCategories() {
        return expenseCategoryRepository.findAll();
    }
}