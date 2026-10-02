package com.pavel.rozpocetbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

/**
 * Třída DebtPaymentDTO představuje datový přenosník pro jednu splátku
 * v rámci konkrétního dluhu.
 */

@Data  // Lombok: generuje gettery, settery, toString a equals/hashCode najednou
@AllArgsConstructor  // Lombok: generuje konstruktor se všemi parametry
@NoArgsConstructor  // Lombok: generuje bezparametrický konstruktor

public class DebtPaymentDTO {

    private Long id;  // unikátní identifikátor splátky
    private Double amount;  // vždy kladné - validace ve service vrstvě
    private LocalDate date;  // datum splátky
    private String note;  // volitelná poznámka, může být null
    private DebtDTO debt;  // Vnořené DTO - celý objekt dluhu, ne jen ID

}