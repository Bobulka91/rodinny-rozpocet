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
 * Entita reprezentující jeden příjem uložený v databázi.
 * Odpovídá tabulce "income".
 */

@Entity              // Říká Hibernate, že tahle třída = databázová tabulka
@Getter              // Lombok: automaticky vygeneruje gettery pro všechny fieldy
@Setter              // Lombok: automaticky vygeneruje settery pro všechny fieldy
@NoArgsConstructor   // Lombok: prázdný konstruktor (Hibernate ho vyžaduje)
@AllArgsConstructor  // Lombok: konstruktor se všemi parametry

public class Income {

    @Id              // Označuje primární klíč (jednoznačné ID záznamu)
    @GeneratedValue  // ID se generuje automaticky (1, 2, 3...)

    private Long id;  // Jednoznačné ID záznamu
    private Double amount;  // Částka příjmu
    private LocalDate date;  // Datum, kdy příjem nastal
    private TypePrijmu type;  // Typ příjmu (např. DÝŠKA, BONUS, etc.)
    private String source;  // Zdroj příjmu (např. zaměstnavatel, projekt, atd.)

}
