package com.pavel.rozpocetbackend.mapper;

import com.pavel.rozpocetbackend.dto.ExpenseDTO;
import com.pavel.rozpocetbackend.entity.Expense;

public class ExpenseMapper {

    /**
     * Převádí Entity Expense na DTO pro odeslání přes API.
     */

    public static ExpenseDTO toDTO(Expense expense) {  // Převod z entity na DTO
        if (expense == null) {  // Kontrola, zda je vstupní objekt null
            return null;  // Pokud je null, vracíme null
        }
        return new ExpenseDTO(  // Vytvoření nového DTO objektu
                expense.getId(),  // ID výdaje
                expense.getAmount(),  // Částka výdaje
                expense.getDate(),  // Datum výdaje
                expense.getCategory()  // Kategorie výdaje
        );
    }

    public static Expense toEntity(ExpenseDTO dto) {  // Převod z DTO na entity
        if (dto == null) {  // Kontrola, zda je vstupní DTO
            return null;  // Pokud je null, vracíme null
        }
        Expense expense = new Expense();  // Vytvoření nové entity Expense
        expense.setId(dto.getId());  // Nastavení ID z DTO
        expense.setAmount(dto.getAmount());  // Nastavení částky z DTO
        expense.setDate(dto.getDate());  // Nastavení data z DTO
        expense.setCategory(dto.getCategory());  // Nastavení kategorie z DTO
        return expense;  // Vrácení vytvořené entity

    }
}
