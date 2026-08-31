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
 * Entita reprezentující jeden konkrétní výdaj (transakci) uložený v databázi.
 * Odkazuje na trvalou kategorii výdaje (ExpenseCategory) - appka si kategorii
 * pamatuje napříč měsíci, jednotlivé výdaje se sčítají zvlášť.
 */
@Entity              // Říká Hibernate, že tahle třída = databázová tabulka "expense"
@Getter              // Lombok: automaticky vygeneruje gettery pro všechny fieldy
@Setter              // Lombok: automaticky vygeneruje settery pro všechny fieldy
@NoArgsConstructor   // Lombok: prázdný konstruktor (Hibernate ho vyžaduje)
@AllArgsConstructor  // Lombok: konstruktor se všemi parametry
public class Expense {

    @Id                                                    // Označuje primární klíč (jednoznačné ID záznamu)
    @GeneratedValue(strategy = GenerationType.IDENTITY)     // ID generuje přímo MySQL (AUTO_INCREMENT), žádná pomocná _seq tabulka
    private Long id;

    private Double amount;   // Konkrétní částka tohoto výdaje
    private LocalDate date;  // Datum, kdy výdaj nastal

    @ManyToOne  // Vztah "mnoho ku jedné": mnoho záznamů Expense může patřit k JEDNÉ ExpenseCategory
    // Appka si díky tomu pamatuje kategorii (např. "Fixní náklady - Nájem") napříč měsíci,
    // aniž by ten text musela ukládat znovu a znovu u každého jednotlivého výdaje.
    private ExpenseCategory expenseCategory;
}