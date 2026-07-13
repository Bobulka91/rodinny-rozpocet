package com.pavel.rozpocetbackend.repository;

import com.pavel.rozpocetbackend.entity.Income;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository pro entitu Income. Spring Data JPA automaticky vygeneruje
 * implementaci s metodami jako save(), findAll(), findById(), deleteById()...
 */

public interface IncomeRepository extends JpaRepository<Income, Long> {
}