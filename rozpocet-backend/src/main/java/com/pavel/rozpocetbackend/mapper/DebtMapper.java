package com.pavel.rozpocetbackend.mapper;

import com.pavel.rozpocetbackend.dto.DebtDTO;
import com.pavel.rozpocetbackend.entity.Debt;

/**
 * Překládač mezi Entity Debt a DTO DebtDTO.
 */

public class DebtMapper {

    /**
     * Převádí Entity Debt na DTO pro odeslání přes API.
     */

    public static DebtDTO toDTO(Debt debt) {
        if (debt == null) {
            return null;
        }
        return new DebtDTO(
                debt.getId(),
                debt.getCategory(),
                debt.getTotalAmount(),
                debt.getPaidAmount()
        );
    }

    /**
     * Převádí DTO přijaté z API zpět na Entity, aby se dalo uložit do databáze.
     */

    public static Debt toEntity(DebtDTO dto) {
        if (dto == null) {
            return null;
        }
        Debt debt = new Debt();
        debt.setId(dto.getId());
        debt.setCategory(dto.getCategory());
        debt.setTotalAmount(dto.getTotalAmount());
        debt.setPaidAmount(dto.getPaidAmount());
        return debt;
    }
}