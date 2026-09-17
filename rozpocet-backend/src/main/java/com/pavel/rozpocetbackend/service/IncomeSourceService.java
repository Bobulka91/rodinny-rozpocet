package com.pavel.rozpocetbackend.service;

import com.pavel.rozpocetbackend.entity.IncomeSource;
import com.pavel.rozpocetbackend.repository.IncomeRepository;
import com.pavel.rozpocetbackend.repository.IncomeSourceRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service vrstva pro IncomeSource - obsahuje business logiku pro trvalé zdroje příjmů
 * (šablony jako "Manželka - Výplata", "Já - Fuška"...).
 */
@Service
public class IncomeSourceService {

    @Autowired  // Spring sem automaticky vloží instanci IncomeSourceRepository
    private IncomeSourceRepository incomeSourceRepository;

    @Autowired  // Potřebujeme kvůli kontrole navázaných příjmů před smazáním
    private IncomeRepository incomeRepository;

    /**
     * Uloží nový zdroj příjmu do databáze.
     */
    public IncomeSource addIncomeSource(IncomeSource incomeSource) {
        return incomeSourceRepository.save(incomeSource);
    }

    /**
     * Vrátí všechny zdroje příjmů z databáze.
     */
    public List<IncomeSource> getAllIncomeSources() {
        return incomeSourceRepository.findAll();
    }

    /**
     * Aktualizuje existující zdroj příjmu podle ID - přepíše všechna pole novými hodnotami.
     * Úprava (na rozdíl od smazání) je vždy povolená, i když na zdroj odkazují příjmy -
     * ty jen budou nadále ukazovat na zdroj s novým jménem/popisem.
     */
    public IncomeSource update(Long id, IncomeSource incomeSource) {
        IncomeSource existing = incomeSourceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Zdroj příjmu s ID " + id + " nenalezen"));
        existing.setPerson(incomeSource.getPerson());  // Přepíšeme osobu (např. "Manželka")
        existing.setLabel(incomeSource.getLabel());    // Přepíšeme popisek (např. "Výplata")
        return incomeSourceRepository.save(existing);
    }

    /**
     * Smaže zdroj příjmu podle ID. Pokud neexistuje, vyhodí výjimku.
     * Pokud na zdroj odkazují nějaké příjmy, smazání ODMÍTNE - appka nechce
     * tiše ztratit historii příjmů, ani je nechat "osiřelé" bez zdroje.
     * Nejdřív je nutné smazat/přesunout všechny navázané příjmy.
     */
    public void delete(Long id) {
        IncomeSource existing = incomeSourceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Zdroj příjmu s ID " + id + " nenalezen"));

        boolean hasLinkedIncomes = incomeRepository.findAll().stream()
                .anyMatch(income -> income.getIncomeSource() != null
                        && income.getIncomeSource().getId().equals(id));

        if (hasLinkedIncomes) {
            throw new IllegalStateException(
                    "Nelze smazat zdroj příjmu s ID " + id + " - existují na něj navázané příjmy. "
                            + "Nejdřív smaž nebo přesuň všechny příjmy používající tento zdroj.");
        }

        incomeSourceRepository.deleteById(id);
    }
}