/**
 * API vrstva pro modul SavingContribution (jednotlivé vklady/výběry v cíli spoření).
 * Stejný vzor jako ostatní api soubory - jen "vnořený" pod /saving-goals/{goalId}.
 */

import request from './client';

// Natáhne historii vkladů/výběrů pro konkrétní cíl spoření
export function getContributions(goalId) {
  return request(`/saving-goals/${goalId}/contributions`);
}

// Přidá nový vklad (nebo záporně výběr) k danému cíli
export function createContribution(goalId, contributionData) {
  return request(`/saving-goals/${goalId}/contributions`, {
    method: 'POST',
    body: JSON.stringify(contributionData),
  });
}

// Smaže vklad/výběr podle ID
export function deleteContribution(id) {
  return request(`/saving-goals/contributions/${id}`, {
    method: 'DELETE',
  });
}