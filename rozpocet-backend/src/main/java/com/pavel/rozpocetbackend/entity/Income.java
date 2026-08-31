package com.pavel.rozpocetbackend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

/**
 * Entita reprezentující jeden konkrétní příjem v daném měsíci.
 * Odkazuje na trvalý zdroj příjmu (IncomeSource) - appka si zdroj pamatuje
 * napříč měsíci, ale konkrétní částka se vždy zadává znovu (výplata kolísá).
 */
@Entity              // Říká Hibernate, že tahle třída = databázová tabulka "income"
@Getter              // Lombok: automaticky vygeneruje gettery pro všechny fieldy
@Setter              // Lombok: automaticky vygeneruje settery pro všechny fieldy
@NoArgsConstructor   // Lombok: prázdný konstruktor (Hibernate ho vyžaduje)
@AllArgsConstructor  // Lombok: konstruktor se všemi parametry
public class Income {

    @Id                                                    // Označuje primární klíč (jednoznačné ID záznamu)
    @GeneratedValue(strategy = GenerationType.IDENTITY)     // ID generuje přímo MySQL (AUTO_INCREMENT), žádná pomocná _seq tabulka
    private Long id;

    private Double amount;   // Konkrétní částka tohoto příjmu za tento měsíc
    private LocalDate date;  // Datum, kdy příjem přišel
    private TypePrijmu type; // Hlavní/vedlejší/jiný příjem (enum)

    @ManyToOne  // Vztah "mnoho ku jedné": mnoho záznamů Income může patřit k JEDNOMU IncomeSource
    // Appka si díky tomu pamatuje zdroj (např. "Manželka - Výplata") napříč všemi měsíci,
    // aniž by ten text musela ukládat znovu a znovu u každého jednotlivého příjmu.
    private IncomeSource incomeSource;
}