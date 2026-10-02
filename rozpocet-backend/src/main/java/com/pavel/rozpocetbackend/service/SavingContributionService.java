package com.pavel.rozpocetbackend.service;

import com.pavel.rozpocetbackend.entity.SavingContribution;
import com.pavel.rozpocetbackend.entity.SavingGoal;
import com.pavel.rozpocetbackend.repository.SavingContributionRepository;
import com.pavel.rozpocetbackend.repository.SavingGoalRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service vrstva pro SavingContribution - obsahuje business logiku pro jednotlivé
 * vklady/výběry v rámci cíle spoření, včetně synchronizace s SavingGoal.currentAmount.
 */
@Service
public class SavingContributionService {

    @Autowired  // Spring sem automaticky vloží instanci SavingContributionRepository
    private SavingContributionRepository savingContributionRepository;

    @Autowired  // Potřebujeme kvůli úpravě currentAmount na rodičovském cíli
    private SavingGoalRepository savingGoalRepository;

    /**
     * Vrátí historii vkladů/výběrů pro konkrétní cíl spoření.
     */
    public List<SavingContribution> getContributionsForGoal(Long savingGoalId) {
        return savingContributionRepository.findBySavingGoalId(savingGoalId);
    }

    /**
     * Přidá nový vklad/výběr k danému cíli spoření A ZÁROVEŇ upraví jeho currentAmount.
     * @Transactional zajišťuje, že obě operace (uložení vkladu + úprava cíle) proběhnou
     * jako jeden celek - pokud by jedna z nich selhala, appka vrátí zpět i tu druhou,
     * místo aby nechala data v nekonzistentním stavu.
     */
    @Transactional
    public SavingContribution addContribution(Long savingGoalId, SavingContribution contribution) {
        SavingGoal goal = savingGoalRepository.findById(savingGoalId)
                .orElseThrow(() -> new EntityNotFoundException("Cíl spoření s ID " + savingGoalId + " nenalezen"));

        contribution.setSavingGoal(goal);
        SavingContribution saved = savingContributionRepository.save(contribution);

        // Přičteme (nebo při záporné částce odečteme) k aktuálně naspořené částce cíle
        goal.setCurrentAmount(goal.getCurrentAmount() + contribution.getAmount());
        savingGoalRepository.save(goal);

        return saved;
    }

    /**
     * Smaže vklad/výběr z historie A ZÁROVEŇ vrátí jeho částku zpět (odečte ji)
     * z currentAmount na příslušném cíli.
     */
    @Transactional
    public void deleteContribution(Long contributionId) {
        SavingContribution contribution = savingContributionRepository.findById(contributionId)
                .orElseThrow(() -> new EntityNotFoundException("Vklad s ID " + contributionId + " nenalezen"));

        SavingGoal goal = contribution.getSavingGoal();
        goal.setCurrentAmount(goal.getCurrentAmount() - contribution.getAmount());
        savingGoalRepository.save(goal);

        savingContributionRepository.delete(contribution);
    }
}