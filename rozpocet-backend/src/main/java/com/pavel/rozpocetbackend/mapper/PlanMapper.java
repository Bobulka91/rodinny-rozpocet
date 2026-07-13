package com.pavel.rozpocetbackend.mapper;

import com.pavel.rozpocetbackend.dto.PlanDTO;
import com.pavel.rozpocetbackend.entity.Plan;

/**
 * Překládač mezi Entity Plan a DTO PlanDTO.
 */

public class PlanMapper {

    /**
     * Převádí Entity Plan na DTO pro odeslání přes API.
     */

    public static PlanDTO toDTO(Plan plan) {
        if (plan == null) {
            return null;
        }
        return new PlanDTO(
                plan.getId(),
                plan.getCategory(),
                plan.getPlannedAmount(),
                plan.getYear(),
                plan.getMonth()
        );
    }

    /**
     * Převádí DTO přijaté z API zpět na Entity, aby se dalo uložit do databáze.
     */

    public static Plan toEntity(PlanDTO dto) {
        if (dto == null) {
            return null;
        }
        Plan plan = new Plan();
        plan.setId(dto.getId());
        plan.setCategory(dto.getCategory());
        plan.setPlannedAmount(dto.getPlannedAmount());
        plan.setYear(dto.getYear());
        plan.setMonth(dto.getMonth());
        return plan;
    }
}