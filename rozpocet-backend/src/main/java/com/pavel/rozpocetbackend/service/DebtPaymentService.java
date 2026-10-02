package com.pavel.rozpocetbackend.service;

import com.pavel.rozpocetbackend.entity.Debt;
import com.pavel.rozpocetbackend.entity.DebtPayment;
import com.pavel.rozpocetbackend.repository.DebtPaymentRepository;
import com.pavel.rozpocetbackend.repository.DebtRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service vrstva pro DebtPayment - obsahuje business logiku pro jednotlivé splátky
 * dluhu, včetně synchronizace s Debt.paidAmount.
 */
@Service
public class DebtPaymentService {

    @Autowired  // Spring sem automaticky vloží instanci DebtPaymentRepository
    private DebtPaymentRepository debtPaymentRepository;

    @Autowired  // Potřebujeme kvůli úpravě paidAmount na rodičovském dluhu
    private DebtRepository debtRepository;

    /**
     * Vrátí historii splátek pro konkrétní dluh.
     */
    public List<DebtPayment> getPaymentsForDebt(Long debtId) {
        return debtPaymentRepository.findByDebtId(debtId);
    }

    /**
     * Přidá novou splátku k danému dluhu A ZÁROVEŇ upraví jeho paidAmount.
     * Na rozdíl od SavingContribution appka tady validuje, že částka splátky
     * je vždy kladná - záporná splátka appce nedává smysl.
     */
    @Transactional
    public DebtPayment addPayment(Long debtId, DebtPayment payment) {
        if (payment.getAmount() == null || payment.getAmount() <= 0) {
            throw new IllegalArgumentException("Částka splátky musí být kladná");
        }

        Debt debt = debtRepository.findById(debtId)
                .orElseThrow(() -> new EntityNotFoundException("Dluh s ID " + debtId + " nenalezen"));

        payment.setDebt(debt);
        DebtPayment saved = debtPaymentRepository.save(payment);

        debt.setPaidAmount(debt.getPaidAmount() + payment.getAmount());
        debtRepository.save(debt);

        return saved;
    }

    /**
     * Smaže splátku z historie A ZÁROVEŇ odečte její částku zpět z paidAmount
     * na příslušném dluhu.
     */
    @Transactional
    public void deletePayment(Long paymentId) {
        DebtPayment payment = debtPaymentRepository.findById(paymentId)
                .orElseThrow(() -> new EntityNotFoundException("Splátka s ID " + paymentId + " nenalezena"));

        Debt debt = payment.getDebt();
        debt.setPaidAmount(debt.getPaidAmount() - payment.getAmount());
        debtRepository.save(debt);

        debtPaymentRepository.delete(payment);
    }
}