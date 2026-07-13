package com.pavel.rozpocetbackend.mapper;

import com.pavel.rozpocetbackend.dto.IncomeDTO;
import com.pavel.rozpocetbackend.entity.Income;

/**
 * Překládač mezi Entity Income a DTO IncomeDTO.
 * Odděluje interní databázovou reprezentaci od dat posílaných přes API.
 */

public class IncomeMapper {

    /**
     * Převádí Entity Income na DTO pro odeslání přes API.
     */

    public static IncomeDTO toDTO(Income income) {
        if (income == null) {  // Ochrana proti null hodnotě
            return null;
        }
        return new IncomeDTO(
                income.getId(),
                income.getAmount(),
                income.getDate(),
                income.getType(),
                income.getSource()
        );
    }

    /**
     * Převádí DTO přijaté z API zpět na Entity, aby se dalo uložit do databáze.
     */

    public static Income toEntity(IncomeDTO dto) {
        if (dto == null) {  // Ochrana proti null hodnotě
            return null;
        }
        Income income = new Income();
        income.setId(dto.getId());
        income.setAmount(dto.getAmount());
        income.setDate(dto.getDate());
        income.setType(dto.getType());
        income.setSource(dto.getSource());
        return income;
    }
}