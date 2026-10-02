package com.pavel.rozpocetbackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

/**
 * Entita SavingContribution reprezentuje jeden vklad (nebo výběr) do konkrétního
 * cíle spoření (SavingGoal). Na rozdíl od SavingGoal, který appka drží jako
 * jeden trvalý "stav" (currentAmount), tohle je HISTORIE jednotlivých pohybů -
 * appka díky tomu nemusí currentAmount přepisovat ručně, ale skládá ho
 * postupně z jednotlivých vkladů/výběrů.
 *
 * amount může být i záporné (výběr ze spoření, oprava chybného zápisu) -
 * na rozdíl od DebtPayment, kde appka zápornou částku validací odmítá.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SavingContribution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // stejně jako ostatní entity - Aiven vyžaduje IDENTITY, ne AUTO
    private Long id;

    private Double amount;  // kladné = vklad, záporné = výběr/oprava

    private LocalDate date;

    private String note;  // volitelné, např. "vklad spoření auto"

    /**
     * Vazba na cíl spoření, ke kterému tenhle vklad patří.
     * FetchType.LAZY - appka nechce vždycky automaticky tahat celý SavingGoal
     * spolu s každým vkladem, jen když ho appka opravdu potřebuje.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "saving_goal_id")
    private SavingGoal savingGoal;
}