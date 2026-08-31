package com.pavel.rozpocetbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO pro IncomeSource - verze určená k odeslání přes API,
 * odděluje interní databázovou reprezentaci od dat pro frontend.
 */
@Data                 // Lombok: gettery, settery, toString, equals/hashCode najednou
@AllArgsConstructor
@NoArgsConstructor
public class IncomeSourceDTO {
    private Long id;
    private String person;  // "Já", "Manželka"
    private String label;   // "Výplata", "Fuška", "Dýško"
}