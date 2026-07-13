/**
 * Custom hook pro natažení a správu dat o výdajích.
 * Stejný vzor (isLoading/error/refetch) mají useIncome, useSavingGoals, useDebts, usePlans.
 */

import { useState, useEffect } from 'react';
import { getAllExpenses } from '../api/expenseApi';

/**
 * Natáhne výdaje z backendu a udrží je v Reactu.
 * Vrací data, stav načítání, případnou chybu, a funkci refetch
 * pro ruční obnovení dat (např. po přidání nové transakce).
 */
function useExpense() {
  const [expenses, setExpenses] = useState([]); // data výdajů z backendu
  const [isLoading, setIsLoading] = useState(true); // stav načítání
  const [error, setError] = useState(null); // chybová zpráva

  /**
   * Natáhne výdaje z backendu. Vytažené mimo useEffect,
   * ať jde zavolat i ručně (viz refetch v návratové hodnotě).
   */
  async function loadExpenses() {
    try {
      setIsLoading(true); // start requestu
      const data = await getAllExpenses(); // dotaz na backend
      setExpenses(data); // uložení dat
    } catch (err) {
      setError(err.message); // zachycení chyby
    } finally {
      setIsLoading(false); // konec načítání, ať se to povedlo nebo ne
    }
  }

  useEffect(() => {
    loadExpenses(); // spuštění jen jednou, při prvním vykreslení
  }, []);

  return { expenses, isLoading, error, refetch: loadExpenses };
}

export default useExpense;