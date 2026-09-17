/**
 * API vrstva pro modul Expense (výdaje).
 * Stejný vzor mají i incomeApi, savingGoalApi, debtApi, planApi.
 */

import request from './client';

// Natáhne všechny výdaje z backendu
export function getAllExpenses() {
  return request('/expenses');
}

// Vytvoří nový výdaj v dané kategorii (categoryId se posílá jako query parametr, ne v těle)
export function createExpense(expenseData, categoryId) {
  return request(`/expenses?categoryId=${categoryId}`, {
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

// Vygeneruje fixní výdaje (nájem, předplatné...) pro daný měsíc/rok,
// pokud tam ještě neexistují - appka "vyrazí" novou kopii ze šablon
export function generateFixedExpenses(year, month) {
  return request(`/expenses/generate-fixed/${year}/${month}`, {
    method: 'POST',
  });
}

// Vrátí sumu výdajů seskupenou podle skupiny (Fixní náklady, Předplatné...)
export function getExpensesByGroup() {
  return request('/expenses/by-group');
}

// Smaže výdaj podle ID
export function deleteExpense(id) {
  return request(`/expenses/${id}`, {
    method: 'DELETE',
  });
}