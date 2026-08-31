package com.pavel.rozpocetbackend.mapper;

import com.pavel.rozpocetbackend.dto.ExpenseCategoryDTO;
import com.pavel.rozpocetbackend.dto.ExpenseDTO;
import com.pavel.rozpocetbackend.entity.Expense;
import com.pavel.rozpocetbackend.entity.ExpenseCategory;

/**
 * Překládač mezi Entity Expense a DTO ExpenseDTO.
 * Zvlášť řeší i převod vnořené ExpenseCategory <-> ExpenseCategoryDTO.
 */
public class ExpenseMapper {

    /**
     * Převádí Entity Expense na DTO pro odeslání přes API.
     * Pokud má Expense přiřazenou kategorii, převede i tu (jinak necháme null).
     */
    public static ExpenseDTO toDTO(Expense expense) {
        if (expense == null) {  // Ochrana proti null hodnotě
            return null;
        }

        ExpenseCategoryDTO categoryDTO = null;
        if (expense.getExpenseCategory() != null) {  // Ověříme, že výdaj vůbec má přiřazenou kategorii
            ExpenseCategory category = expense.getExpenseCategory();
            categoryDTO = new ExpenseCategoryDTO(
                    category.getId(),
                    category.getCategoryGroup(),
                    category.getLabel(),
                    category.getType(),
                    category.getAmount()
            );
        }

        return new ExpenseDTO(
                expense.getId(),
                expense.getAmount(),
                expense.getDate(),
                categoryDTO
        );
    }

    /**
     * Převádí DTO přijaté z API zpět na Entity, aby se dalo uložit do databáze.
     * Poznámka: expenseCategory se sem musí dosadit zvlášť v Service vrstvě podle ID,
     * protože appka nechce vytvářet novou ExpenseCategory při každém uložení výdaje.
     */
    public static Expense toEntity(ExpenseDTO dto) {
        if (dto == null) {  // Ochrana proti null hodnotě
            return null;
        }
        Expense expense = new Expense();
        expense.setId(dto.getId());
        expense.setAmount(dto.getAmount());
        expense.setDate(dto.getDate());
        // expenseCategory se nastavuje zvlášť v Service - viz další krok
        return expense;
    }
}