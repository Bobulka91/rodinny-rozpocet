package com.pavel.rozpocetbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO pro Expense - verze určená k odeslání přes API.
 * Obsahuje vnořené ExpenseCategoryDTO místo pouhého ID, aby frontend
 * hned viděl skupinu a label kategorie bez dalšího dotazu.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExpenseDTO {
    private Long id;
    private Double amount;
    private LocalDate date;
    private ExpenseCategoryDTO expenseCategory;  // Vnořené DTO - celý objekt kategorie, ne jen ID
}