package com.pavel.rozpocetbackend.mapper;

import com.pavel.rozpocetbackend.dto.MonthlyBalanceDTO;
import com.pavel.rozpocetbackend.entity.MonthlyBalance;

/**
 * Překládač mezi Entity MonthlyBalance a DTO MonthlyBalanceDTO.
 */
public class MonthlyBalanceMapper {

    /**
     * Převádí Entity MonthlyBalance na DTO pro odeslání přes API.
     */
    public static MonthlyBalanceDTO toDTO(MonthlyBalance balance) {
        if (balance == null) {  // Ochrana proti null hodnotě
            return null;
        }
        return new MonthlyBalanceDTO(
                balance.getId(),
                balance.getYear(),
                balance.getMonth(),
                balance.getCarryOver(),
                balance.getClosingBalance()
        );
    }
}