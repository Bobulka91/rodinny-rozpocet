package com.pavel.rozpocetbackend.mapper;

import com.pavel.rozpocetbackend.dto.SavingContributionDTO;
import com.pavel.rozpocetbackend.dto.SavingGoalDTO;
import com.pavel.rozpocetbackend.entity.SavingContribution;
import com.pavel.rozpocetbackend.entity.SavingGoal;

/**
 * Překládač mezi Entity SavingContribution a DTO SavingContributionDTO.
 * Zvlášť řeší i převod vnořeného SavingGoal <-> SavingGoalDTO.
 */
public class SavingContributionMapper {

    /**
     * Převádí Entity SavingContribution na DTO pro odeslání přes API.
     * Pokud má vklad přiřazený cíl, převede i ten (jinak necháme null).
     */
    public static SavingContributionDTO toDTO(SavingContribution contribution) {
        if (contribution == null) {
            return null;
        }

        SavingGoalDTO goalDTO = null;
        if (contribution.getSavingGoal() != null) {  // Ověříme, že vklad vůbec má přiřazený cíl
            SavingGoal goal = contribution.getSavingGoal();
            goalDTO = new SavingGoalDTO(goal.getId(), goal.getCategory(), goal.getTargetAmount(), goal.getCurrentAmount());
        }

        return new SavingContributionDTO(
                contribution.getId(),
                contribution.getAmount(),
                contribution.getDate(),
                contribution.getNote(),
                goalDTO
        );
    }

    /**
     * Převádí DTO přijaté z API zpět na Entity, aby se dalo uložit do databáze.
     * Poznámka: SavingGoal se sem musí dosadit zvlášť v Service vrstvě podle ID,
     * stejně jako appka řeší IncomeSource u Income.
     */
    public static SavingContribution toEntity(SavingContributionDTO dto) {
        if (dto == null) {
            return null;
        }
        SavingContribution contribution = new SavingContribution();
        contribution.setId(dto.getId());
        contribution.setAmount(dto.getAmount());
        contribution.setDate(dto.getDate());
        contribution.setNote(dto.getNote());
        // savingGoal se nastavuje zvlášť v Service - viz další krok
        return contribution;
    }
}