package com.pavel.rozpocetbackend.repository;

import com.pavel.rozpocetbackend.entity.SavingContribution;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SavingContributionRepository extends JpaRepository<SavingContribution, Long> {

    /**
     * Vrátí historii vkladů/výběrů pro konkrétní cíl spoření -
     * appka tohle použije na GET /api/saving-goals/{id}/contributions.
     */
    List<SavingContribution> findBySavingGoalId(Long savingGoalId);
}