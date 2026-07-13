/**
 * API vrstva pro modul Plan (plánování rozpočtu).
 * Plan reprezentuje "kolik chci utratit v dané kategorii za daný měsíc/rok".
 * Stejný vzor mají i expenseApi, incomeApi, savingGoalApi, debtApi.
 */

import request from './client';

// Natáhne všechny plány z backendu (napříč všemi měsíci/roky)
export function getAllPlans() {
  return request('/plans');
}

// Vytvoří nový plán pro danou kategorii/měsíc/rok
export function createPlan(planData) {
  return request('/plans', {
    method: 'POST',
    body: JSON.stringify(planData),
  });
}

// Upraví existující plán podle ID
export function updatePlan(id, planData) {
  return request(`/plans/${id}`, {
    method: 'PUT',
    body: JSON.stringify(planData),
  });
}

// Smaže plán podle ID
export function deletePlan(id) {
  return request(`/plans/${id}`, {
    method: 'DELETE',
  });
}

// Porovná plánovanou částku (planned) se skutečnými výdaji/příjmy dané
// kategorie a měsíce (actual) a vrátí i rozdíl (difference).
// Backend si toto porovnání dopočítá za běhu, nikde se neukládá
// (viz Plan.compareToActual() na backendu).
export function comparePlan(id) {
  return request(`/plans/${id}/compare`);
}