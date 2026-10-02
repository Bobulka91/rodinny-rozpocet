package com.pavel.rozpocetbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

/**
 * Třída SavingContributionDTO představuje datový přenosník pro jeden vklad/výběr
 * v rámci konkrétního cíle spoření.
 */

@Data  // Lombok: generuje gettery, settery, toString a equals/hashCode najednou
@AllArgsConstructor  // Lombok: generuje konstruktor se všemi parametry
@NoArgsConstructor  // Lombok: generuje bezparametrický konstruktor

public class SavingContributionDTO {

    private Long id;  // unikátní identifikátor vkladu
    private Double amount;  // kladné = vklad, záporné = výběr/oprava
    private LocalDate date;  // datum vkladu
    private String note;  // volitelná poznámka, může být null
    private SavingGoalDTO savingGoal;  // Vnořené DTO - celý objekt cíle, ne jen ID

}