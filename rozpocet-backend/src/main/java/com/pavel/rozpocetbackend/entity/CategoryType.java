package com.pavel.rozpocetbackend.entity;

/**
 * Enum rozlišující typ kategorie výdaje - ovlivňuje, jestli se částka
 * přenáší mezi měsíci automaticky, nebo se počítá vždy od nuly.
 */
public enum CategoryType {
    FIXNI,       // Fixní náklady, Předplatné - částka se přenáší mezi měsíci
    PROMENLIVA   // Každodenní výdaje - počítá se od nuly každý měsíc
}