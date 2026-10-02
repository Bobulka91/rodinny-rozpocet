package com.pavel.rozpocetbackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

/**
 * Entita DebtPayment reprezentuje jednu splátku konkrétního dluhu (Debt).
 * Stejný princip jako SavingContribution - historie jednotlivých pohybů,
 * ze které appka skládá paidAmount na Debt, místo aby ho přepisovala ručně.
 *
 * Na rozdíl od SavingContribution appka amount validuje jako VŽDY KLADNÉ -
 * splátka dluhu záporně nedává smysl (na to appka nemá "výběr", jen splátky).
 * Tahle validace se řeší až ve service vrstvě (appka zatím nemá Bean Validation).
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DebtPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Aiven vyžaduje IDENTITY, ne AUTO
    private Long id;

    private Double amount;  // vždy kladné - validace ve service vrstvě

    private LocalDate date;

    private String note;  // volitelné, např. "splátka hypotéky - listopad"

    /**
     * Vazba na dluh, ke kterému tahle splátka patří.
     * FetchType.LAZY - stejný důvod jako u SavingContribution.savingGoal.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "debt_id")
    private Debt debt;
}