package com.pavel.rozpocetbackend.repository;

import com.pavel.rozpocetbackend.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository pro entitu Expense. Spring Data JPA automaticky vygeneruje
 * implementaci s metodami jako save(), findAll(), findById(), deleteById()...
 */

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
}