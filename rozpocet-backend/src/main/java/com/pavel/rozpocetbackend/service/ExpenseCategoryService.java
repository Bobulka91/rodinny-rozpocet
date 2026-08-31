package com.pavel.rozpocetbackend.service;

import com.pavel.rozpocetbackend.entity.ExpenseCategory;
import com.pavel.rozpocetbackend.repository.ExpenseCategoryRepository;
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

    /**
     * Uloží novou kategorii výdaje do databáze.
     */
    public ExpenseCategory addExpenseCategory(ExpenseCategory expenseCategory) {
        return expenseCategoryRepository.save(expenseCategory);
    }

    /**
     * Vrátí všechny kategorie výdajů z databáze.
     */
    public List<ExpenseCategory> getAllExpenseCategories() {
        return expenseCategoryRepository.findAll();
    }
}