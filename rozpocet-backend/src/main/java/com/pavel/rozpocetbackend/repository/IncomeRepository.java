package com.pavel.rozpocetbackend.repository;

import com.pavel.rozpocetbackend.entity.Income;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IncomeRepository extends JpaRepository<Income, Long> {
}