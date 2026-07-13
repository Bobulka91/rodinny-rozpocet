package com.pavel.rozpocetbackend.dto;

import com.pavel.rozpocetbackend.entity.TypePrijmu;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

/**
 * Třída IncomeDTO představuje datový přenosník pro příjmy.
 */

@Data  // Lombok: generuje gettery, settery, toString a equals/hashCode najednou
@AllArgsConstructor  // Lombok: generuje konstruktor se všemi parametry
@NoArgsConstructor  // Lombok: generuje bezparametrický konstruktor

public class IncomeDTO {

    private Long id; // unikátní identifikátor příjmu
    private Double amount;  // částka příjmu
    private LocalDate date;  // datum příjmu
    private TypePrijmu type;  // typ příjmu
    private String source;  // zdroj příjmu

}
