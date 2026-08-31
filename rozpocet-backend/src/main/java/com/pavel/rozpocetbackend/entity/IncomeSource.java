package com.pavel.rozpocetbackend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entita reprezentující trvalý zdroj příjmu (šablonu) - např. "Manželka - Výplata".
 * Jednou vytvořený zdroj appka pamatuje napříč všemi měsíci.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class IncomeSource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // použije nativní MySQL AUTO_INCREMENT, žádná _seq tabulka
    private Long id;

    private String person;   // "Já", "Manželka"
    private String label;    // "Výplata", "Fuška", "Dýško"
}