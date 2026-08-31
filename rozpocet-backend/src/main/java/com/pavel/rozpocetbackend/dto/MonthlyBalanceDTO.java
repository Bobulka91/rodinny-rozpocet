package com.pavel.rozpocetbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO pro MonthlyBalance - verze určená k odeslání přes API.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MonthlyBalanceDTO {
    private Long id;
    private Integer year;
    private Integer month;
    private Double carryOver;
    private Double closingBalance;
}