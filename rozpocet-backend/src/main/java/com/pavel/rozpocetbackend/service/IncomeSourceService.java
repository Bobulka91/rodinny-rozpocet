package com.pavel.rozpocetbackend.service;

import com.pavel.rozpocetbackend.entity.IncomeSource;
import com.pavel.rozpocetbackend.repository.IncomeSourceRepository;
import com.pavel.rozpocetbackend.repository.IncomeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IncomeSourceService {

    @Autowired
    private IncomeSourceRepository incomeSourceRepository;

    @Autowired  // Potřebujeme pro kontrolu, jestli zdroj ještě někdo používá (viz deleteIncomeSource)
    private IncomeRepository incomeRepository;

    public IncomeSource addIncomeSource(IncomeSource incomeSource) {
        return incomeSourceRepository.save(incomeSource);
    }

    // Update existujícího zdroje příjmu podle ID.
    public IncomeSource updateIncomeSource(Long id, IncomeSource updatedSource) {
        IncomeSource existing = incomeSourceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("IncomeSource not found: " + id));

        existing.setPerson(updatedSource.getPerson());
        existing.setLabel(updatedSource.getLabel());

        return incomeSourceRepository.save(existing);
    }

    // Smazání zdroje příjmu podle ID - s ochranou proti smazání zdroje,
    // který je ještě navázaný na existující příjmy.
    public void deleteIncomeSource(Long id) {
        if (!incomeSourceRepository.existsById(id)) {
            throw new IllegalArgumentException("IncomeSource not found: " + id);
        }

        boolean isInUse = incomeRepository.findAll().stream()
                .anyMatch(income -> income.getIncomeSource() != null
                        && income.getIncomeSource().getId().equals(id));

        if (isInUse) {
            throw new IllegalStateException(
                    "Zdroj příjmu nelze smazat - existují na něj navázané příjmy.");
        }

        incomeSourceRepository.deleteById(id);
    }

    public List<IncomeSource> getAllIncomeSources() {
        return incomeSourceRepository.findAll();
    }
}