/**
 * API vrstva pro modul IncomeSource (trvalé šablony zdrojů příjmů).
 * Stejný CRUD vzor jako ostatní moduly.
 */
import request from './client';

// Natáhne všechny zdroje příjmů z backendu
export function getAllIncomeSources() {
  return request('/income-sources');
}

// Vytvoří nový zdroj příjmu
export function createIncomeSource(sourceData) {
  return request('/income-sources', {
    method: 'POST',
    body: JSON.stringify(sourceData),
  });
}

// Upraví existující zdroj příjmu podle ID
export function updateIncomeSource(id, sourceData) {
  return request(`/income-sources/${id}`, {
    method: 'PUT',
    body: JSON.stringify(sourceData),
  });
}

// Smaže zdroj příjmu podle ID
export function deleteIncomeSource(id) {
  return request(`/income-sources/${id}`, {
    method: 'DELETE',
  });
}