/**
 * API vrstva pro modul ExpenseCategory (trvalé šablony kategorií výdajů).
 * Stejný CRUD vzor jako ostatní moduly.
 */
import request from './client';

// Natáhne všechny kategorie výdajů z backendu
export function getAllExpenseCategories() {
  return request('/expense-categories');
}

// Vytvoří novou kategorii výdajů
export function createExpenseCategory(categoryData) {
  return request('/expense-categories', {
    method: 'POST',
    body: JSON.stringify(categoryData),
  });
}

// Upraví existující kategorii výdajů podle ID
export function updateExpenseCategory(id, categoryData) {
  return request(`/expense-categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(categoryData),
  });
}

// Smaže kategorii výdajů podle ID
export function deleteExpenseCategory(id) {
  return request(`/expense-categories/${id}`, {
    method: 'DELETE',
  });
}