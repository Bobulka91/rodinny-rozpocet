package com.pavel.rozpocetbackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

/**
 * Entita reprezentující jeden dluh uložený v databázi.
 * Odpovídá tabulce "debt".
 */

@Entity              // Říká Hibernate, že tahle třída = databázová tabulka
@Getter              // Lombok: automaticky vygeneruje gettery pro všechny fieldy
@Setter              // Lombok: automaticky vygeneruje settery pro všechny fieldy
@NoArgsConstructor   // Lombok: prázdný konstruktor (Hibernate ho vyžaduje)
@AllArgsConstructor  // Lombok: konstruktor se všemi parametry

public class Debt {

    @Id           // Označuje primární klíč (jednoznačné ID záznamu)
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // použije nativní MySQL AUTO_INCREMENT, žádná _seq tabulka

    private Long id;  // Jednoznačné ID záznamu
    private String category;  // Kategorie dluhu (Nájem, Jídlo, PHM...)
    private Double totalAmount;  // Celková částka dluhu
    private Double paidAmount;  // Uplacená částka - appka ji dál udržuje jako uložené pole,
    // jen ji teď navíc upravuje při každé splátce (viz DebtPayment)

    /**
     * Historie jednotlivých splátek k tomuto dluhu.
     * cascade = ALL + orphanRemoval = true -> smažeš Debt, appka automaticky
     * smaže i všechny jeho DebtPayment (na rozdíl od IncomeSource/ExpenseCategory,
     * kde appka mazání se sdílenou historií naopak BLOKUJE).
     * mappedBy = "debt" musí přesně odpovídat názvu fieldu v DebtPayment.
     */
    @OneToMany(mappedBy = "debt", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DebtPayment> payments = new ArrayList<>();

}