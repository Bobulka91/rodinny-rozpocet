package com.pavel.rozpocetbackend.mapper;

import com.pavel.rozpocetbackend.dto.SavingGoalDTO;
import com.pavel.rozpocetbackend.entity.SavingGoal;

/**
 * Překládač mezi Entity SavingGoal a DTO SavingGoalDTO.
 */

public class SavingGoalMapper {

    /**
     * Převádí Entity SavingGoal na DTO pro odeslání přes API.
     */

    public static SavingGoalDTO toDTO(SavingGoal goal) {
        if (goal == null) {
            return null;
        }
        return new SavingGoalDTO(
                goal.getId(),
                goal.getCategory(),
                goal.getTargetAmount(),
                goal.getCurrentAmount()
        );
    }

    /**
     * Převádí DTO přijaté z API zpět na Entity, aby se dalo uložit do databáze.
     */

    public static SavingGoal toEntity(SavingGoalDTO dto) {
        if (dto == null) {
            return null;
        }
        SavingGoal goal = new SavingGoal();
        goal.setId(dto.getId());
        goal.setCategory(dto.getCategory());
        goal.setTargetAmount(dto.getTargetAmount());
        goal.setCurrentAmount(dto.getCurrentAmount());
        return goal;
    }
}