/**
 * API vrstva pro modul Income (příjmy).
 * Stejný vzor mají i expenseApi, savingGoalApi, debtApi, planApi.
 */

import request from './client';

// Natáhne všechny příjmy z backendu
export function getAllIncomes() {
  return request('/incomes');
}

// Vytvoří nový příjem
export function createIncome(incomeData) {
  return request('/incomes', {
    method: 'POST',
    body: JSON.stringify(incomeData),
  });
}

// Upraví existující příjem podle ID
export function updateIncome(id, incomeData) {
  return request(`/incomes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(incomeData),
  });
}

// Smaže příjem podle ID
export function deleteIncome(id) {
  return request(`/incomes/${id}`, {
    method: 'DELETE',
  });
}