package com.pavel.rozpocetbackend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.GenerationType;

/**
 * Entita reprezentující jeden výdaj uložený v databázi.
 * Odpovídá tabulce "expense".
 */

@Entity              // Říká Hibernate, že tahle třída = databázová tabulka
@Getter              // Lombok: automaticky vygeneruje gettery pro všechny fieldy
@Setter              // Lombok: automaticky vygeneruje settery pro všechny fieldy
@NoArgsConstructor   // Lombok: prázdný konstruktor (Hibernate ho vyžaduje)
@AllArgsConstructor  // Lombok: konstruktor se všemi parametry

public class SavingGoal {

    @Id             // Označuje primární klíč (jednoznačné ID záznamu)
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // použije nativní MySQL AUTO_INCREMENT, žádná _seq tabulka

    private Long id;  // Primární klíč (jednoznačné ID záznamu)
    private String category;  // Kategorie spoření (např. "Dovolená", "Nouzový fond")
    private Double targetAmount;  // Cílová částka, kterou chce uživatel naspořit
    private Double currentAmount;  // Aktuální naspořená částka

}
