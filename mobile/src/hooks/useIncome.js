/**
 * Custom hook pro natažení a správu dat o příjmech.
 * Stejný vzor mají useExpense, useSavingGoals, useDebts, usePlans.
 */

import { useState, useEffect } from 'react';
import { getAllIncomes } from '../api/incomeApi';

/**
 * Natáhne příjmy z backendu a udrží je v Reactu.
 * Vrací data, stav načítání, případnou chybu, a funkci refetch
 * pro ruční obnovení dat (např. po přidání nové transakce).
 */
function useIncome() {
  const [incomes, setIncomes] = useState([]); // data příjmů z backendu
  const [isLoading, setIsLoading] = useState(true); // stav načítání
  const [error, setError] = useState(null); // chybová zpráva

  /**
   * Natáhne příjmy z backendu. Vytažené mimo useEffect,
   * ať jde zavolat i ručně (viz refetch v návratové hodnotě).
   */
  async function loadIncomes() {
    try {
      setIsLoading(true); // start requestu
      const data = await getAllIncomes(); // dotaz na backend
      setIncomes(data); // uložení dat
    } catch (err) {
      setError(err.message); // zachycení chyby
    } finally {
      setIsLoading(false); // konec načítání, ať se to povedlo nebo ne
    }
  }

  useEffect(() => {
    loadIncomes(); // spuštění jen jednou, při prvním vykreslení
  }, []);

  return { incomes, isLoading, error, refetch: loadIncomes };
}

export default useIncome;