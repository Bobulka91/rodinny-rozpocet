package com.pavel.rozpocetbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Třída DebtDTO představuje datový přenosník pro dluhy.
 */

@Data  // Lombok: generuje gettery, settery, toString a equals/hashCode najednou
@AllArgsConstructor  // Lombok: generuje konstruktor se všemi parametry
@NoArgsConstructor  // Lombok: generuje bezparametrický konstruktor

public class DebtDTO {

    private Long id;  // unikátní identifikátor dluhu
    private String category;  // kategorie dluhu (např. půjčka, kredit
    private Double totalAmount;  // celková částka dluhu
    private Double paidAmount;  // částka, která byla již splacena

}
