package com.pavel.rozpocetbackend.repository;

import com.pavel.rozpocetbackend.entity.Debt;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository pro entitu Debt. Spring Data JPA automaticky vygeneruje
 * implementaci s metodami jako save(), findAll(), findById(), deleteById()...
 */

public interface DebtRepository extends JpaRepository<Debt, Long> {
}