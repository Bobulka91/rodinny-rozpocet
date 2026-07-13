package com.pavel.rozpocetbackend.service;

import com.pavel.rozpocetbackend.entity.Debt;
import com.pavel.rozpocetbackend.repository.DebtRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * Service vrstva pro Debt - obsahuje business logiku pro dluhy
 * (ukládání, výpočet procentuálního splacení, celkové součty).
 */

@Service
public class DebtService {

    @Autowired  // Spring sem automaticky vloží instanci DebtRepository
    private DebtRepository debtRepository;

    /**
     * Uloží nový dluh do databáze.
     */

    public Debt addDebt(Debt debt) {
        return debtRepository.save(debt);
    }

    /**
     * Vrátí všechny dluhy z databáze.
     */

    public List<Debt> getAllDebts() {
        return debtRepository.findAll();
    }

    /**
     * Spočítá procentuální pokrok splacení konkrétního dluhu.
     */

    public Double getPaidPercentage(Long id) {
        Debt debt = debtRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Debt not found with id: " + id));

        if (debt.getTotalAmount() == 0) {  // Ochrana proti dělení nulou
            return 0.0;
        }

        return (debt.getPaidAmount() / debt.getTotalAmount()) * 100;
    }

    /**
     * Sečte celkovou dlužnou částku napříč všemi dluhy.
     */

    public Double getTotalDebtAmount() {
        return debtRepository.findAll()
                .stream()
                .mapToDouble(Debt::getTotalAmount)
                .sum();
    }

    /**
     * Sečte, kolik už bylo splaceno napříč všemi dluhy.
     */

    public Double getTotalPaidAmount() {
        return debtRepository.findAll()
                .stream()
                .mapToDouble(Debt::getPaidAmount)
                .sum();
    }

    /**
     * Aktualizuje existující dluh podle ID - přepíše všechna pole novými hodnotami z DTO.
     */
    public Debt update(Long id, Debt debt) {
        Debt existing = debtRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Dluh s ID " + id + " nenalezen"));
        existing.setCategory(debt.getCategory());
        existing.setTotalAmount(debt.getTotalAmount());
        existing.setPaidAmount(debt.getPaidAmount());
        return debtRepository.save(existing);
    }

    /**
     * Smaže dluh podle ID. Pokud neexistuje, vyhodí výjimku.
     */
    public void delete(Long id) {
        if (!debtRepository.existsById(id)) {
            throw new EntityNotFoundException("Dluh s ID " + id + " nenalezen");
        }
        debtRepository.deleteById(id);
    }
}