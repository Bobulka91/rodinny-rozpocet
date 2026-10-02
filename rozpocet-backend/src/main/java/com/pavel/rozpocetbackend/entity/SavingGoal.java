package com.pavel.rozpocetbackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

/**
 * Entita reprezentující jeden cíl spoření uložený v databázi.
 * Odpovídá tabulce "saving_goal".
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
    private Double currentAmount;  // Aktuální naspořená částka - appka ji dál udržuje jako uložené pole,
    // jen ji teď navíc upravuje při každém vkladu/výběru (viz SavingContribution)

    /**
     * Historie jednotlivých vkladů/výběrů k tomuto cíli.
     * cascade = ALL + orphanRemoval = true -> smažeš SavingGoal, appka automaticky
     * smaže i všechny jeho SavingContribution (na rozdíl od IncomeSource/ExpenseCategory,
     * kde appka mazání se sdílenou historií naopak BLOKUJE).
     * mappedBy = "savingGoal" musí přesně odpovídat názvu fieldu v SavingContribution.
     */
    @OneToMany(mappedBy = "savingGoal", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SavingContribution> contributions = new ArrayList<>();

}