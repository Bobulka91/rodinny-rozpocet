/**
 * API vrstva pro modul DebtPayment (jednotlivé splátky dluhu).
 * Stejný vzor jako ostatní api soubory - jen "vnořený" pod /debts/{debtId}.
 */

import request from './client';

// Natáhne historii splátek pro konkrétní dluh
export function getPayments(debtId) {
  return request(`/debts/${debtId}/payments`);
}

// Přidá novou splátku k danému dluhu
export function createPayment(debtId, paymentData) {
  return request(`/debts/${debtId}/payments`, {
    method: 'POST',
    body: JSON.stringify(paymentData),
  });
}

// Smaže splátku podle ID
export function deletePayment(id) {
  return request(`/debts/payments/${id}`, {
    method: 'DELETE',
  });
}