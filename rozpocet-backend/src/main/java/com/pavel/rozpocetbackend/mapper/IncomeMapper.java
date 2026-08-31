package com.pavel.rozpocetbackend.mapper;

import com.pavel.rozpocetbackend.dto.IncomeDTO;
import com.pavel.rozpocetbackend.dto.IncomeSourceDTO;
import com.pavel.rozpocetbackend.entity.Income;
import com.pavel.rozpocetbackend.entity.IncomeSource;

/**
 * Překládač mezi Entity Income a DTO IncomeDTO.
 * Zvlášť řeší i převod vnořeného IncomeSource <-> IncomeSourceDTO.
 */
public class IncomeMapper {

    /**
     * Převádí Entity Income na DTO pro odeslání přes API.
     * Pokud má Income přiřazený zdroj, převede i ten (jinak necháme null).
     */
    public static IncomeDTO toDTO(Income income) {
        if (income == null) {
            return null;
        }

        IncomeSourceDTO sourceDTO = null;
        if (income.getIncomeSource() != null) {  // Ověříme, že příjem vůbec má přiřazený zdroj
            IncomeSource source = income.getIncomeSource();
            sourceDTO = new IncomeSourceDTO(source.getId(), source.getPerson(), source.getLabel());
        }

        return new IncomeDTO(
                income.getId(),
                income.getAmount(),
                income.getDate(),
                income.getType(),
                sourceDTO
        );
    }

    /**
     * Převádí DTO přijaté z API zpět na Entity, aby se dalo uložit do databáze.
     * Poznámka: IncomeSource se sem musí dosadit zvlášť v Service vrstvě podle ID,
     * protože appka nechce vytvářet nový IncomeSource při každém uložení příjmu.
     */
    public static Income toEntity(IncomeDTO dto) {
        if (dto == null) {
            return null;
        }
        Income income = new Income();
        income.setId(dto.getId());
        income.setAmount(dto.getAmount());
        income.setDate(dto.getDate());
        income.setType(dto.getType());
        // incomeSource se nastavuje zvlášť v Service - viz další krok
        return income;
    }
}