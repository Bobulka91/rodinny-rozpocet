package com.pavel.rozpocetbackend.repository;

import com.pavel.rozpocetbackend.entity.SavingGoal;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository pro entitu SavingGoal. Spring Data JPA automaticky vygeneruje
 * implementaci s metodami jako save(), findAll(), findById(), deleteById()...
 */

public interface SavingGoalRepository extends JpaRepository<SavingGoal, Long> {
}