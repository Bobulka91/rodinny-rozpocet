package com.pavel.rozpocetbackend.repository;

import com.pavel.rozpocetbackend.entity.MonthlyBalance;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository pro entitu MonthlyBalance. Spring Data JPA automaticky vygeneruje
 * implementaci s metodami jako save(), findAll(), findById(), deleteById()...
 */
public interface MonthlyBalanceRepository extends JpaRepository<MonthlyBalance, Long> {
}