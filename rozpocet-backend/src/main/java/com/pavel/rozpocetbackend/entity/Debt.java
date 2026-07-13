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

public class Debt {

    @Id              // Označuje primární klíč (jednoznačné ID záznamu)
    @GeneratedValue  // ID se generuje automaticky (1, 2, 3...)

    private Long id;  // Jednoznačné ID záznamu
    private String category;  // Kategorie dluhu (Nájem, Jídlo, PHM...)
    private Double totalAmount;  // Celková částka dluhu
    private Double paidAmount;  // Uplacená částka

}
