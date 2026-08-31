/**
 * API vrstva pro modul SavingGoal (cíle spoření).
 * Stejný vzor mají i expenseApi, incomeApi, debtApi, planApi.
 */

import request from './client';

// Natáhne všechny cíle spoření z backendu
export function getAllSavingGoals() {
  return request('/saving-goals');
}

// Vytvoří nový cíl spoření
export function createSavingGoal(goalData) {
  return request('/saving-goals', {
    method: 'POST',
    body: JSON.stringify(goalData),
  });
}

// Upraví existující cíl spoření podle ID
export function updateSavingGoal(id, goalData) {
  return request(`/saving-goals/${id}`, {
    method: 'PUT',
    body: JSON.stringify(goalData),
  });
}

// Smaže cíl spoření podle ID
export function deleteSavingGoal(id) {
  return request(`/saving-goals/${id}`, {
    method: 'DELETE',
  });
}