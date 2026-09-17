package com.pavel.rozpocetbackend.service;

import com.pavel.rozpocetbackend.entity.ExpenseCategory;
import com.pavel.rozpocetbackend.repository.ExpenseCategoryRepository;
import com.pavel.rozpocetbackend.repository.ExpenseRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service vrstva pro ExpenseCategory - obsahuje business logiku pro trvalé kategorie
 * výdajů (šablony jako "Fixní náklady - Nájem", "Předplatné - Netflix"...).
 */
@Service
public class ExpenseCategoryService {

    @Autowired  // Spring sem automaticky vloží instanci ExpenseCategoryRepository
    private ExpenseCategoryRepository expenseCategoryRepository;

    @Autowired  // Potřebujeme kvůli kontrole navázaných výdajů před smazáním
    private ExpenseRepository expenseRepository;

    /**
     * Uloží novou kategorii výdaje do databáze.
     */
    public ExpenseCategory addExpenseCategory(ExpenseCategory expenseCategory) {
        return expenseCategoryRepository.save(expenseCategory);
    }

    /**
     * Vrátí všechny kategorie výdajů z databáze.
     */
    public List<ExpenseCategory> getAllExpenseCategories() {
        return expenseCategoryRepository.findAll();
    }

    /**
     * Aktualizuje existující kategorii výdaje podle ID - přepíše všechna pole novými hodnotami.
     * Úprava (na rozdíl od smazání) je vždy povolená, i když na kategorii odkazují výdaje -
     * ty jen budou nadále ukazovat na kategorii s novým jménem/skupinou/částkou.
     */
    public ExpenseCategory update(Long id, ExpenseCategory expenseCategory) {
        ExpenseCategory existing = expenseCategoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Kategorie výdaje s ID " + id + " nenalezena"));
        existing.setCategoryGroup(expenseCategory.getCategoryGroup());  // Přepíšeme skupinu (např. "Fixní náklady")
        existing.setLabel(expenseCategory.getLabel());                  // Přepíšeme popisek (např. "Nájem")
        existing.setType(expenseCategory.getType());                    // Přepíšeme typ (FIXNI/PROMENLIVA)
        existing.setAmount(expenseCategory.getAmount());                // Přepíšeme přenášenou částku
        return expenseCategoryRepository.save(existing);
    }

    /**
     * Smaže kategorii výdaje podle ID. Pokud neexistuje, vyhodí výjimku.
     * Pokud na kategorii odkazují nějaké výdaje, smazání ODMÍTNE - appka nechce
     * tiše ztratit historii výdajů, ani je nechat "osiřelé" bez kategorie.
     * Nejdřív je nutné smazat/přesunout všechny navázané výdaje.
     */
    public void delete(Long id) {
        ExpenseCategory existing = expenseCategoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Kategorie výdaje s ID " + id + " nenalezena"));

        boolean hasLinkedExpenses = expenseRepository.findAll().stream()
                .anyMatch(expense -> expense.getExpenseCategory() != null
                        && expense.getExpenseCategory().getId().equals(id));

        if (hasLinkedExpenses) {
            throw new IllegalStateException(
                    "Nelze smazat kategorii výdaje s ID " + id + " - existují na ni navázané výdaje. "
                            + "Nejdřív smaž nebo přesuň všechny výdaje používající tuto kategorii.");
        }

        expenseCategoryRepository.deleteById(id);
    }
}