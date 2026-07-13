package com.pavel.rozpocetbackend.service;

import com.pavel.rozpocetbackend.entity.Debt;
import com.pavel.rozpocetbackend.repository.DebtRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

/**
 * Testy pro DebtService - ověřují správnost výpočtu procenta splacení dluhu.
 */
@ExtendWith(MockitoExtension.class)
class DebtServiceTest {

    @Mock
    private DebtRepository debtRepository;

    @InjectMocks
    private DebtService debtService;

    /**
     * Ověřuje, že se procento splacení dluhu spočítá správně u normálních hodnot.
     */
    @Test
    void getPaidPercentage_shouldCalculateCorrectly() {
        // Arrange
        Debt debt = new Debt();
        debt.setId(1L);
        debt.setTotalAmount(30000.0);
        debt.setPaidAmount(11700.0);

        when(debtRepository.findById(1L)).thenReturn(Optional.of(debt));

        // Act
        Double result = debtService.getPaidPercentage(1L);

        // Assert (11700/30000*100 = 39%)
        assertEquals(39.0, result, 0.01);
    }

    /**
     * Ověřuje, že appka vrátí 0%, když je celková částka dluhu nula (ochrana proti dělení nulou).
     */
    @Test
    void getPaidPercentage_shouldReturnZero_whenTotalAmountIsZero() {
        // Arrange
        Debt debt = new Debt();
        debt.setId(2L);
        debt.setTotalAmount(0.0);
        debt.setPaidAmount(0.0);

        when(debtRepository.findById(2L)).thenReturn(Optional.of(debt));

        // Act
        Double result = debtService.getPaidPercentage(2L);

        // Assert
        assertEquals(0.0, result, 0.01);
    }
}