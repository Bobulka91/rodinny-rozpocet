package com.pavel.rozpocetbackend.service;

import com.pavel.rozpocetbackend.entity.Income;
import com.pavel.rozpocetbackend.repository.IncomeRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service vrstva pro Income - obsahuje business logiku (ukládání, výpočty za rok/měsíc).
 */

@Service
public class IncomeService {

    @Autowired  // Spring sem automaticky vloží instanci IncomeRepository
    private IncomeRepository incomeRepository;

    /**
     * Uloží nový příjem do databáze.
     */

    public Income addIncome(Income income) {
        return incomeRepository.save(income);
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
     * Aktualizuje existující příjem podle ID - přepíše všechna pole novými hodnotami z DTO.
     */
    public Income update(Long id, Income income) {
        Income existing = incomeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Příjem s ID " + id + " nenalezen"));
        existing.setAmount(income.getAmount());
        existing.setDate(income.getDate());
        existing.setType(income.getType());
        existing.setSource(income.getSource());
        return incomeRepository.save(existing);
    }

    /**
     * Smaže příjem podle ID. Pokud neexistuje, vyhodí výjimku.
     */
    public void delete(Long id) {
        if (!incomeRepository.existsById(id)) {
            throw new EntityNotFoundException("Příjem s ID " + id + " nenalezen");
        }
        incomeRepository.deleteById(id);
    }

}