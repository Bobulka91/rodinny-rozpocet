package com.pavel.rozpocetbackend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entita reprezentující jeden výdaj uložený v databázi.
 * Odpovídá tabulce "expense".
 */

@Entity              // Říká Hibernate, že tahle třída = databázová tabulka
@Getter              // Lombok: automaticky vygeneruje gettery pro všechny fieldy
@Setter              // Lombok: automaticky vygeneruje settery pro všechny fieldy
@NoArgsConstructor   // Lombok: prázdný konstruktor (Hibernate ho vyžaduje)
@AllArgsConstructor  // Lombok: konstruktor se všemi parametry

  public class Plan {

    @Id              // Označuje primární klíč (jednoznačné ID záznamu)
    @GeneratedValue  // ID se generuje automaticky (1, 2, 3...)

    private Long id;  // Jednoznačné ID záznamu
    private String category;  // Kategorie výdaje (např. Potraviny, Doprava, Zábava, atd.)
    private Double plannedAmount;  // Plánovaná částka výdaje
    private Integer year;  // Rok, pro který je plán vytvořen
    private Integer month;  // Měsíc, pro který je plán vytvořen (1-12)

}
