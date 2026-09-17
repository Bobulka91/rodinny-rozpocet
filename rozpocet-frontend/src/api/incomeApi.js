/**
 * API vrstva pro modul Income (příjmy).
 * Stejný vzor mají i expenseApi, savingGoalApi, debtApi, planApi.
 */

import request from './client';

// Natáhne všechny příjmy z backendu
export function getAllIncomes() {
  return request('/incomes');
}

// Vytvoří nový příjem z daného zdroje (sourceId se posílá jako query parametr, ne v těle)
export function createIncome(incomeData, sourceId) {
  return request(`/incomes?sourceId=${sourceId}`, {
    method: 'POST',
    body: JSON.stringify(incomeData),
  });
}

// Upraví existující příjem podle ID, volitelně i se změnou zdroje (sourceId)
export function updateIncome(id, incomeData, sourceId) {
  const query = sourceId ? `?sourceId=${sourceId}` : '';
  return request(`/incomes/${id}${query}`, {
    method: 'PUT',
    body: JSON.stringify(incomeData),
  });
}

// Vrátí sumu příjmů seskupenou podle osoby (Já, Manželka...)
export function getIncomeByPerson() {
  return request('/incomes/by-person');
}

// Smaže příjem podle ID
export function deleteIncome(id) {
  return request(`/incomes/${id}`, {
    method: 'DELETE',
  });
}