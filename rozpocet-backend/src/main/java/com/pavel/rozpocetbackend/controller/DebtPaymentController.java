package com.pavel.rozpocetbackend.controller;

import com.pavel.rozpocetbackend.dto.DebtPaymentDTO;
import com.pavel.rozpocetbackend.entity.DebtPayment;
import com.pavel.rozpocetbackend.mapper.DebtPaymentMapper;
import com.pavel.rozpocetbackend.service.DebtPaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Třída DebtPaymentController je zodpovědná za zpracování HTTP požadavků
 * týkajících se jednotlivých splátek dluhu.
 */
@RestController  // Označení třídy jako REST Controller
@RequestMapping("/api/debts")  // Základní URL - stejná jako u DebtController, endpointy jsou "vnořené"
public class DebtPaymentController {

    @Autowired  // Automatické injektování instance DebtPaymentService
    private DebtPaymentService debtPaymentService;

    /**
     * Vrátí historii splátek pro konkrétní dluh.
     */
    @GetMapping("/{debtId}/payments")  // GET /api/debts/{debtId}/payments
    public List<DebtPaymentDTO> getPayments(@PathVariable Long debtId) {
        return debtPaymentService.getPaymentsForDebt(debtId)
                .stream()
                .map(DebtPaymentMapper::toDTO)
                .toList();
    }

    /**
     * Přidá novou splátku k danému dluhu. Service vrstva zároveň upraví
     * paidAmount dluhu a validuje, že částka je kladná.
     */
    @PostMapping("/{debtId}/payments")  // POST /api/debts/{debtId}/payments
    public DebtPaymentDTO addPayment(@PathVariable Long debtId, @RequestBody DebtPaymentDTO dto) {
        DebtPayment paymentEntity = DebtPaymentMapper.toEntity(dto);
        DebtPayment saved = debtPaymentService.addPayment(debtId, paymentEntity);
        return DebtPaymentMapper.toDTO(saved);
    }

    /**
     * Smaže splátku z historie. Service vrstva zároveň odečte její částku
     * zpět z paidAmount příslušného dluhu.
     */
    @DeleteMapping("/payments/{paymentId}")  // DELETE /api/debts/payments/{paymentId}
    public ResponseEntity<Void> deletePayment(@PathVariable Long paymentId) {
        debtPaymentService.deletePayment(paymentId);
        return ResponseEntity.noContent().build();
    }
}