package com.pavel.rozpocetbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Třída SavingGoalDTO představuje datový přenosník pro cíle spoření.
 */

@Data  // Lombok: generuje gettery, settery, toString a equals/hashCode najednou
@AllArgsConstructor  // Lombok: generuje konstruktor se všemi parametry
@NoArgsConstructor  // Lombok: generuje bezparametrický konstruktor

public class SavingGoalDTO {

    private Long id;  // unikátní identifikátor cíle spoření
    private String category;  // kategorie cíle spoření (např. dovolen
    private Double targetAmount;  // cílová částka, kterou chce uživatel naspořit
    private Double currentAmount;  // aktuální částka, kterou uživatel již naspořil

}
