package com.pavel.rozpocetbackend.mapper;

import com.pavel.rozpocetbackend.dto.DebtDTO;
import com.pavel.rozpocetbackend.dto.DebtPaymentDTO;
import com.pavel.rozpocetbackend.entity.Debt;
import com.pavel.rozpocetbackend.entity.DebtPayment;

/**
 * Překládač mezi Entity DebtPayment a DTO DebtPaymentDTO.
 * Zvlášť řeší i převod vnořeného Debt <-> DebtDTO.
 */
public class DebtPaymentMapper {

    /**
     * Převádí Entity DebtPayment na DTO pro odeslání přes API.
     * Pokud má splátka přiřazený dluh, převede i ten (jinak necháme null).
     */
    public static DebtPaymentDTO toDTO(DebtPayment payment) {
        if (payment == null) {
            return null;
        }

        DebtDTO debtDTO = null;
        if (payment.getDebt() != null) {  // Ověříme, že splátka vůbec má přiřazený dluh
            Debt debt = payment.getDebt();
            debtDTO = new DebtDTO(debt.getId(), debt.getCategory(), debt.getTotalAmount(), debt.getPaidAmount());
        }

        return new DebtPaymentDTO(
                payment.getId(),
                payment.getAmount(),
                payment.getDate(),
                payment.getNote(),
                debtDTO
        );
    }

    /**
     * Převádí DTO přijaté z API zpět na Entity, aby se dalo uložit do databáze.
     * Poznámka: Debt se sem musí dosadit zvlášť v Service vrstvě podle ID,
     * stejně jako appka řeší SavingGoal u SavingContribution.
     */
    public static DebtPayment toEntity(DebtPaymentDTO dto) {
        if (dto == null) {
            return null;
        }
        DebtPayment payment = new DebtPayment();
        payment.setId(dto.getId());
        payment.setAmount(dto.getAmount());
        payment.setDate(dto.getDate());
        payment.setNote(dto.getNote());
        // debt se nastavuje zvlášť v Service - viz další krok
        return payment;
    }
}