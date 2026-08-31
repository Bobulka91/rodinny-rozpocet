/**
 * Custom hook pro natažení a správu dat o cílech spoření.
 * Stejný vzor mají useExpense, useIncome, useDebts, usePlans.
 */

import { useState, useEffect } from 'react';
import { getAllSavingGoals } from '../api/savingGoalApi';

/**
 * Natáhne cíle spoření z backendu a udrží je v Reactu.
 * Vrací data, stav načítání, případnou chybu, a funkci refetch
 * pro ruční obnovení dat (např. po přidání nového cíle).
 */
function useSavingGoals() {
  const [savingGoals, setSavingGoals] = useState([]); // data cílů spoření
  const [isLoading, setIsLoading] = useState(true); // stav načítání
  const [error, setError] = useState(null); // chybová zpráva

  /**
   * Natáhne cíle spoření z backendu. Vytažené mimo useEffect,
   * ať jde zavolat i ručně (viz refetch v návratové hodnotě).
   */
  async function loadSavingGoals() {
    try {
      setIsLoading(true); // start requestu
      const data = await getAllSavingGoals(); // dotaz na backend
      setSavingGoals(data); // uložení dat
    } catch (err) {
      setError(err.message); // zachycení chyby
    } finally {
      setIsLoading(false); // konec načítání, ať se to povedlo nebo ne
    }
  }

  useEffect(() => {
    loadSavingGoals(); // spuštění jen jednou, při prvním vykreslení
  }, []);

  return { savingGoals, isLoading, error, refetch: loadSavingGoals };
}

export default useSavingGoals;