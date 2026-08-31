/**
 * Custom hook pro natažení a správu dat o dluzích.
 * Stejný vzor mají useExpense, useIncome, useSavingGoals, usePlans.
 */

import { useState, useEffect } from 'react';
import { getAllDebts } from '../api/debtApi';

/**
 * Natáhne dluhy z backendu a udrží je v Reactu.
 * Vrací data, stav načítání, případnou chybu, a funkci refetch
 * pro ruční obnovení dat (např. po přidání nového dluhu).
 */
function useDebts() {
  const [debts, setDebts] = useState([]); // data dluhů
  const [isLoading, setIsLoading] = useState(true); // stav načítání
  const [error, setError] = useState(null); // chybová zpráva

  /**
   * Natáhne dluhy z backendu. Vytažené mimo useEffect,
   * ať jde zavolat i ručně (viz refetch v návratové hodnotě).
   */
  async function loadDebts() {
    try {
      setIsLoading(true); // start requestu
      const data = await getAllDebts(); // dotaz na backend
      setDebts(data); // uložení dat
    } catch (err) {
      setError(err.message); // zachycení chyby
    } finally {
      setIsLoading(false); // konec načítání, ať se to povedlo nebo ne
    }
  }

  useEffect(() => {
    loadDebts(); // spuštění jen jednou, při prvním vykreslení
  }, []);

  return { debts, isLoading, error, refetch: loadDebts };
}

export default useDebts;