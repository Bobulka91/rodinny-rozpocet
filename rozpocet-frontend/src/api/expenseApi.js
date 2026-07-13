/**
 * API vrstva pro modul Expense (výdaje).
 * Stejný vzor mají i incomeApi, savingGoalApi, debtApi, planApi.
 */

import request from './client';

// Natáhne všechny výdaje z backendu
export function getAllExpenses() {
  return request('/expenses');
}

// Vytvoří nový výdaj
export function createExpense(expenseData) {
  return request('/expenses', {
    method: 'POST',
    body: JSON.stringify(expenseData),
  });
}

// Upraví existující výdaj podle ID
export function updateExpense(id, expenseData) {
  return request(`/expenses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(expenseData),
  });
}

// Smaže výdaj podle ID
export function deleteExpense(id) {
  return request(`/expenses/${id}`, {
    method: 'DELETE',
  });
}