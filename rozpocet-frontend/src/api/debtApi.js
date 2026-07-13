/**
 * API vrstva pro modul Debt (dluhy).
 * Stejný vzor mají i expenseApi, incomeApi, savingGoalApi, planApi.
 */

import request from './client';

// Natáhne všechny dluhy z backendu
export function getAllDebts() {
  return request('/debts');
}

// Vytvoří nový dluh
export function createDebt(debtData) {
  return request('/debts', {
    method: 'POST',
    body: JSON.stringify(debtData),
  });
}

// Upraví existující dluh podle ID
export function updateDebt(id, debtData) {
  return request(`/debts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(debtData),
  });
}

// Smaže dluh podle ID
export function deleteDebt(id) {
  return request(`/debts/${id}`, {
    method: 'DELETE',
  });
}