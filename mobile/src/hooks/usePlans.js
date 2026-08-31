/**
 * Custom hook pro natažení a správu dat o plánech.
 * Stejný vzor mají useExpense, useIncome, useSavingGoals, useDebts.
 */

import { useState, useEffect } from 'react';
import { getAllPlans } from '../api/planApi';

/**
 * Natáhne plány z backendu a udrží je v Reactu.
 * Vrací data, stav načítání, případnou chybu, a funkci refetch
 * pro ruční obnovení dat 
 */
function usePlans() {
  const [plans, setPlans] = useState([]); // data plánů
  const [isLoading, setIsLoading] = useState(true); // stav načítání
  const [error, setError] = useState(null); // chybová zpráva

  // Natáhne plány z backendu. Vytažené mimo useEffect,
  // ať jde zavolat i ručně (viz refetch v návratové hodnotě).
  async function loadPlans() {
    try {
      setIsLoading(true); // start requestu
      const data = await getAllPlans(); // dotaz na backend
      setPlans(data); // uložení dat
    } catch (err) {
      setError(err.message); // zachycení chyby
    } finally {
      setIsLoading(false); // konec načítání
    }
  }

  useEffect(() => {
    loadPlans(); // jen jedno spuštění při startu
  }, []);

  return { plans, isLoading, error, refetch: loadPlans }; // pro ruční obnovu dat
}

export default usePlans;