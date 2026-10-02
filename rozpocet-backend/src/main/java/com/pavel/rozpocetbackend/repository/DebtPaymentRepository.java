package com.pavel.rozpocetbackend.repository;

import com.pavel.rozpocetbackend.entity.DebtPayment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DebtPaymentRepository extends JpaRepository<DebtPayment, Long> {

    /**
     * Vrátí historii splátek pro konkrétní dluh -
     * appka tohle použije na GET /api/debts/{id}/payments.
     */
    List<DebtPayment> findByDebtId(Long debtId);
}