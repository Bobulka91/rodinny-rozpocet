package com.pavel.rozpocetbackend.repository;

import com.pavel.rozpocetbackend.entity.ExpenseCategory;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository pro entitu ExpenseCategory. Spring Data JPA automaticky vygeneruje
 * implementaci s metodami jako save(), findAll(), findById(), deleteById()...
 */
public interface ExpenseCategoryRepository extends JpaRepository<ExpenseCategory, Long> {
}