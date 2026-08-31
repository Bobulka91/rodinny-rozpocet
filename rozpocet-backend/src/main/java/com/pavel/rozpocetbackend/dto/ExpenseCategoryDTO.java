package com.pavel.rozpocetbackend.dto;

import com.pavel.rozpocetbackend.entity.CategoryType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO pro ExpenseCategory - verze určená k odeslání přes API,
 * odděluje interní databázovou reprezentaci od dat pro frontend.
 */
@Data                 // Lombok: gettery, settery, toString, equals/hashCode najednou
@AllArgsConstructor
@NoArgsConstructor
public class ExpenseCategoryDTO {
    private Long id;
    private String categoryGroup;  // "Fixní náklady", "Předplatné", "Každodenní výdaje"
    private String label;          // "Nájem", "Kafe", "Netflix"
    private CategoryType type;     // FIXNI nebo PROMENLIVA
    private Double amount;         // Jen relevantní pro FIXNI - přenášená částka
}