/**
 * Custom hook pro natažení sumy výdajů podle skupiny (Fixní náklady, Předplatné...).
 * Na rozdíl od ostatních hooků vrací Map<String, Double>, ne pole objektů.
 */
import { useState, useEffect } from 'react';
import { getExpensesByGroup } from '../api/expenseApi';

/**
 * Natáhne sumy výdajů po skupinách z backendu.
 * Vrací data (objekt {skupina: částka}), stav načítání, chybu, refetch.
 */
function useExpensesByGroup() {
  const [expensesByGroup, setExpensesByGroup] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadExpensesByGroup() {
    try {
      setIsLoading(true);
      const data = await getExpensesByGroup();
      setExpensesByGroup(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadExpensesByGroup();
  }, []);

  return { expensesByGroup, isLoading, error, refetch: loadExpensesByGroup };
}

export default useExpensesByGroup;