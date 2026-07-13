package com.pavel.rozpocetbackend.repository;

import com.pavel.rozpocetbackend.entity.Plan;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository pro entitu Plan. Spring Data JPA automaticky vygeneruje
 * implementaci s metodami jako save(), findAll(), findById(), deleteById()...
 */

public interface PlanRepository extends JpaRepository<Plan, Long> {
}