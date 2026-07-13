package com.pavel.rozpocetbackend.service;

import com.pavel.rozpocetbackend.entity.SavingGoal;
import com.pavel.rozpocetbackend.repository.SavingGoalRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

/**
 * Testy pro SavingGoalService - ověřují správnost výpočtu procenta splnění cíle spoření.
 */
@ExtendWith(MockitoExtension.class)  // Aktivuje Mockito framework pro tuhle testovací třídu
class SavingGoalServiceTest {

    @Mock  // Vytvoří falešnou (mock) verzi repository - test se nepřipojuje ke skutečné databázi
    private SavingGoalRepository savingGoalRepository;

    @InjectMocks  // Vytvoří skutečnou instanci Service a vloží do ní mock repository
    private SavingGoalService savingGoalService;

    /**
     * Ověřuje, že se procento splnění cíle spočítá správně u normálních hodnot.
     */
    @Test  // Označuje metodu jako jeden konkrétní testovací případ
    void getProgressPercentage_shouldCalculateCorrectly() {
        // Arrange - připravíme testovací cíl spoření
        SavingGoal goal = new SavingGoal();
        goal.setId(1L);
        goal.setTargetAmount(150000.0);
        goal.setCurrentAmount(51000.0);

        // Řekneme mocku, co má vrátit, když se zavolá findById(1L)
        when(savingGoalRepository.findById(1L)).thenReturn(Optional.of(goal));

        // Act - zavoláme testovanou metodu
        Double result = savingGoalService.getProgressPercentage(1L);

        // Assert - ověříme, že výsledek odpovídá očekávání (51000/150000*100 = 34%)
        assertEquals(34.0, result, 0.01);
    }

    /**
     * Ověřuje, že appka vrátí 0%, když je cílová částka nula (ochrana proti dělení nulou).
     */
    @Test
    void getProgressPercentage_shouldReturnZero_whenTargetAmountIsZero() {
        // Arrange - cíl s nulovou cílovou částkou
        SavingGoal goal = new SavingGoal();
        goal.setId(2L);
        goal.setTargetAmount(0.0);
        goal.setCurrentAmount(500.0);

        when(savingGoalRepository.findById(2L)).thenReturn(Optional.of(goal));

        // Act
        Double result = savingGoalService.getProgressPercentage(2L);

        // Assert - appka by měla vrátit 0.0, ne spadnout na dělení nulou
        assertEquals(0.0, result, 0.01);
    }
}