package com.pavel.rozpocetbackend.service;

import com.pavel.rozpocetbackend.entity.SavingGoal;
import com.pavel.rozpocetbackend.repository.SavingGoalRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * Service vrstva pro SavingGoal - obsahuje business logiku pro cíle spoření
 * (ukládání, výpočet procentuálního pokroku, celkové součty).
 */

@Service
public class SavingGoalService {

    @Autowired  // Spring sem automaticky vloží instanci SavingGoalRepository
    private SavingGoalRepository savingGoalRepository;

    /**
     * Uloží nový cíl spoření do databáze.
     */

    public SavingGoal addSavingGoal(SavingGoal savingGoal) {
        return savingGoalRepository.save(savingGoal);
    }

    /**
     * Vrátí všechny cíle spoření z databáze.
     */

    public List<SavingGoal> getAllSavingGoals() {
        return savingGoalRepository.findAll();
    }

    /**
     * Spočítá procentuální pokrok konkrétního cíle (kolik % z cílové částky je naspořeno).
     */

    public Double getProgressPercentage(Long id) {
        SavingGoal savingGoal = savingGoalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Saving goal not found with id: " + id));

        if (savingGoal.getTargetAmount() == 0) {  // Ochrana proti dělení nulou
            return 0.0;
        }

        return (savingGoal.getCurrentAmount() / savingGoal.getTargetAmount()) * 100;
    }

    /**
     * Sečte cílové částky všech cílů dohromady (kolik chci celkem naspořit).
     */

    public Double getTotalTargetAmount() {
        return savingGoalRepository.findAll()
                .stream()
                .mapToDouble(SavingGoal::getTargetAmount)
                .sum();
    }

    /**
     * Sečte aktuálně naspořené částky všech cílů dohromady.
     */

    public Double getTotalCurrentAmount() {
        return savingGoalRepository.findAll()
                .stream()
                .mapToDouble(SavingGoal::getCurrentAmount)
                .sum();
    }

    /**
     * Aktualizuje existující cíl spoření podle ID - přepíše všechna pole novými hodnotami z DTO.
     */
    public SavingGoal update(Long id, SavingGoal savingGoal) {
        SavingGoal existing = savingGoalRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cíl spoření s ID " + id + " nenalezen"));
        existing.setCategory(savingGoal.getCategory());
        existing.setTargetAmount(savingGoal.getTargetAmount());
        existing.setCurrentAmount(savingGoal.getCurrentAmount());
        return savingGoalRepository.save(existing);
    }

    /**
     * Smaže cíl spoření podle ID. Pokud neexistuje, vyhodí výjimku.
     */
    public void delete(Long id) {
        if (!savingGoalRepository.existsById(id)) {
            throw new EntityNotFoundException("Cíl spoření s ID " + id + " nenalezen");
        }
        savingGoalRepository.deleteById(id);
    }
}