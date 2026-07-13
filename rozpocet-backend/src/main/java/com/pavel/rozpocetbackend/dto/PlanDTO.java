package com.pavel.rozpocetbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Třída PlanDTO představuje datový přenosník pro plány.
 */

@Data  // Lombok: generuje gettery, settery, toString a equals/hashCode najednou
@AllArgsConstructor  // Lombok: generuje konstruktor se všemi parametry
@NoArgsConstructor  // Lombok: generuje bezparametrický konstruktor

public class PlanDTO {

    private Long id;  // unikátní identifikátor plánu
    private String category;  // kategorie plánu (např. příjem, výdaj, dluh, spoření)
    private Double plannedAmount;  // plánovaná částka pro danou kategorii
    private Integer year;  // rok, pro který je plán vytvořen
    private Integer month;  // měsíc, pro který je plán vytvořen

}
