package com.pavel.rozpocetbackend.controller;

import com.pavel.rozpocetbackend.dto.SavingContributionDTO;
import com.pavel.rozpocetbackend.entity.SavingContribution;
import com.pavel.rozpocetbackend.mapper.SavingContributionMapper;
import com.pavel.rozpocetbackend.service.SavingContributionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Třída SavingContributionController je zodpovědná za zpracování HTTP požadavků
 * týkajících se jednotlivých vkladů/výběrů v rámci cílů spoření.
 */
@RestController  // Označení třídy jako REST Controller
@RequestMapping("/api/saving-goals")  // Základní URL - stejná jako u SavingGoalController, endpointy jsou "vnořené"
public class SavingContributionController {

    @Autowired  // Automatické injektování instance SavingContributionService
    private SavingContributionService savingContributionService;

    /**
     * Vrátí historii vkladů/výběrů pro konkrétní cíl spoření.
     */
    @GetMapping("/{goalId}/contributions")  // GET /api/saving-goals/{goalId}/contributions
    public List<SavingContributionDTO> getContributions(@PathVariable Long goalId) {
        return savingContributionService.getContributionsForGoal(goalId)
                .stream()
                .map(SavingContributionMapper::toDTO)
                .toList();
    }

    /**
     * Přidá nový vklad/výběr k danému cíli spoření. Service vrstva zároveň
     * upraví currentAmount cíle, appka to tady jen spouští.
     */
    @PostMapping("/{goalId}/contributions")  // POST /api/saving-goals/{goalId}/contributions
    public SavingContributionDTO addContribution(@PathVariable Long goalId, @RequestBody SavingContributionDTO dto) {
        SavingContribution contributionEntity = SavingContributionMapper.toEntity(dto);
        SavingContribution saved = savingContributionService.addContribution(goalId, contributionEntity);
        return SavingContributionMapper.toDTO(saved);
    }

    /**
     * Smaže vklad/výběr z historie. Service vrstva zároveň vrátí jeho částku
     * zpět do currentAmount příslušného cíle.
     */
    @DeleteMapping("/contributions/{contributionId}")  // DELETE /api/saving-goals/contributions/{contributionId}
    public ResponseEntity<Void> deleteContribution(@PathVariable Long contributionId) {
        savingContributionService.deleteContribution(contributionId);
        return ResponseEntity.noContent().build();
    }
}