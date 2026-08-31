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
 * Entita reprezentující uložený zůstatek pro konkrétní měsíc/rok.
 * Ukládá se, aby appka nemusela při každém dotazu přepočítávat celou historii
 * od začátku - jednou spočítaný zůstatek se uloží a příště se jen přečte.
 */
@Entity              // Říká Hibernate, že tahle třída = databázová tabulka "monthly_balance"
@Getter              // Lombok: automaticky vygeneruje gettery pro všechny fieldy
@Setter              // Lombok: automaticky vygeneruje settery pro všechny fieldy
@NoArgsConstructor   // Lombok: prázdný konstruktor (Hibernate ho vyžaduje)
@AllArgsConstructor  // Lombok: konstruktor se všemi parametry
public class MonthlyBalance {

    @Id                                                    // Označuje primární klíč (jednoznačné ID záznamu)
    @GeneratedValue(strategy = GenerationType.IDENTITY)     // ID generuje přímo MySQL (AUTO_INCREMENT)
    private Long id;

    private Integer year;             // Rok, ke kterému se zůstatek vztahuje
    private Integer month;            // Měsíc (1-12), ke kterému se zůstatek vztahuje
    private Double carryOver;         // Kolik appka přenesla DO tohohle měsíce z toho předchozího
    private Double closingBalance;    // Kolik zůstalo NA KONCI tohohle měsíce (přenese se dál do dalšího)
}