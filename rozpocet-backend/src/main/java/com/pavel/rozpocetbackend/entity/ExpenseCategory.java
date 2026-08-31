package com.pavel.rozpocetbackend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entita reprezentující trvalou kategorii výdaje (šablonu) - např. "Fixní náklady - Nájem".
 * U FIXNI kategorií se částka (amount) přenáší mezi měsíci automaticky,
 * u PROMENLIVA kategorií se amount nepoužívá - počítá se vždy nově z jednotlivých transakcí.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // použije nativní MySQL AUTO_INCREMENT, žádná _seq tabulka
    private Long id;

    private String categoryGroup;   // "Fixní náklady", "Předplatné"...
    private String label;    // "Nájem", "Kafe", "Netflix"

    @Enumerated(EnumType.STRING)  // Uloží enum jako text ("FIXNI"), ne jako číslo
    private CategoryType type;

    private Double amount;   // Jen relevantní pro FIXNI - aktuální přenášená částka
}