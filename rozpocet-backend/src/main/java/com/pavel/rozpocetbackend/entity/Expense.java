package com.pavel.rozpocetbackend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

/**
 * Entita reprezentující jeden výdaj uložený v databázi.
 * Odpovídá tabulce "expense".
 */
@Entity              // Říká Hibernate, že tahle třída = databázová tabulka
@Getter              // Lombok: automaticky vygeneruje gettery pro všechny fieldy
@Setter              // Lombok: automaticky vygeneruje settery pro všechny fieldy
@NoArgsConstructor   // Lombok: prázdný konstruktor (Hibernate ho vyžaduje)
@AllArgsConstructor  // Lombok: konstruktor se všemi parametry

public class Expense {

    @Id              // Označuje primární klíč (jednoznačné ID záznamu)
    @GeneratedValue  // ID se generuje automaticky (1, 2, 3...)

    private Long id;  // Jednoznačné ID výdaje
    private Double amount;  // Částka výdaje
    private LocalDate date;  // Datum, kdy výdaj nastal
    private String category;  // Kategorie výdaje (Nájem, Jídlo, PHM...)

}

