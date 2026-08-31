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
     * Na rozdíl od pouhého zdroje (label) tady jde o to, KOMU příjem patří -
     * appka sečte třeba všechny příjmy patřící "Manželka" dohromady, bez ohledu
     * na to, jestli jde o výplatu, brigádu nebo dýško. Používá se pro souhrnné
     * částky "Já: X Kč", "Manželka: Y Kč" na Slide 2.
     */
    public Map<String, Double> getIncomeByPerson() {
        return incomeRepository.findAll()
                .stream()
                .filter(income -> income.getIncomeSource() != null)  // Přeskočíme příjmy bez zdroje
                .collect(Collectors.groupingBy(
                        income -> income.getIncomeSource().getPerson(),  // Klíčem je osoba
                        Collectors.summingDouble(Income::getAmount)
                ));
    }
}