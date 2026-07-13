package com.pavel.rozpocetbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

/**
 * Třída ExpenseDTO představuje datový přenosník pro výdaje.
 */

@Data  // Lombok: generuje gettery, settery, toString a equals/hashCode najednou
@AllArgsConstructor  // Lombok: generuje konstruktor se všemi parametry
@NoArgsConstructor  // Lombok: generuje bezparametrický konstruktor

public class ExpenseDTO {

    private Long id;  // unikátní identifikátor výdaje
    private Double amount;  // částka výdaje
    private LocalDate date;  // datum výdaje
    private String category;  // kategorie výdaje

}

