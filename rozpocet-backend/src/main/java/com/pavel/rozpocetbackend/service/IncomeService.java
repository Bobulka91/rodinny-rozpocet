package com.pavel.rozpocetbackend.service;

import com.pavel.rozpocetbackend.entity.Income;
import com.pavel.rozpocetbackend.entity.IncomeSource;
import com.pavel.rozpocetbackend.repository.IncomeRepository;
import com.pavel.rozpocetbackend.repository.IncomeSourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service vrstva pro Income - obsahuje business logiku (ukládání, agregace, výpočty).
 */
@Service
public class IncomeService {

    @Autowired  // Spring sem automaticky vloží instanci IncomeRepository
    private IncomeRepository incomeRepository;

    @Autowired  // Spring sem automaticky vloží instanci IncomeSourceRepository
    private IncomeSourceRepository incomeSourceRepository;

    /**
     * Uloží nový příjem do databáze. sourceId přichází zvlášť (z Controlleru),
     * appka najde existující IncomeSource podle ID a přiřadí ho příjmu.
     */
    public Income addIncome(Income income, Long sourceId) {
        IncomeSource source = incomeSourceRepository.findById(sourceId)
                .orElseThrow(() -> new IllegalArgumentException("IncomeSource not found: " + sourceId));
        income.setIncomeSource(source);
        return incomeRepository.save(income);
    }

    // Update existujícího příjmu podle ID.
    // Stejný vzor jako u addIncome - ověříme, že příjem i zdroj existují,
    // přepíšeme hodnoty a uložíme (save() na existující ID = update).
    public Income updateIncome(Long id, Income updatedIncome, Long sourceId) {
        Income existingIncome = incomeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Income not found: " + id));

        IncomeSource source = incomeSourceRepository.findById(sourceId)
                .orElseThrow(() -> new IllegalArgumentException("IncomeSource not found: " + sourceId));

        existingIncome.setAmount(updatedIncome.getAmount());
        existingIncome.setDate(updatedIncome.getDate());
        existingIncome.setType(updatedIncome.getType());
        existingIncome.setIncomeSource(source);

        return incomeRepository.save(existingIncome);
    }

    // Smazání příjmu podle ID.
    public void deleteIncome(Long id) {
        if (!incomeRepository.existsById(id)) {
            throw new IllegalArgumentException("Income not found: " + id);
        }
        incomeRepository.deleteById(id);
    }

    /**
     * Vrátí všechny příjmy z databáze.
     */
    public List<Income> getAllIncomes() {
        return incomeRepository.findAll();
    }

    /**
     * Sečte všechny příjmy za konkrétní rok (jedno celkové číslo).
     */
    public Double getTotalIncomeForYear(int year) {
        return incomeRepository.findAll()
                .stream()
                .filter(income -> income.getDate().getYear() == year)
                .mapToDouble(Income::getAmount)
                .sum();
    }

    /**
     * Seskupí příjmy podle měsíce (1-12) pro daný rok - data pro sloupcový graf.
     */
    public Map<Integer, Double> getMonthlyIncomeForYear(int year) {
        return incomeRepository.findAll()
                .stream()
                .filter(income -> income.getDate().getYear() == year)
                .collect(Collectors.groupingBy(
                        income -> income.getDate().getMonthValue(),
                        Collectors.summingDouble(Income::getAmount)
                ));
    }

    /**
     * Seskupí všechny příjmy podle osoby (person z IncomeSource) a sečte částky.
     */
    public Map<String, Double> getIncomeByPerson() {
        return incomeRepository.findAll()
                .stream()
                .filter(income -> income.getIncomeSource() != null)
                .collect(Collectors.groupingBy(
                        income -> income.getIncomeSource().getPerson(),
                        Collectors.summingDouble(Income::getAmount)
                ));
    }
}