/**
 * Custom hook pro natažení a správu dat o kategoriích výdajů (trvalé šablony).
 * Stejný vzor jako ostatní datové hooky (isLoading/error/refetch).
 */
import { useState, useEffect } from 'react';
import { getAllExpenseCategories } from '../api/expenseCategoryApi';

/**
 * Natáhne kategorie výdajů z backendu a udrží je v Reactu.
 * Vrací data, stav načítání, případnou chybu, a funkci refetch.
 */
function useExpenseCategories() {
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadExpenseCategories() {
    try {
      setIsLoading(true);
      const data = await getAllExpenseCategories();
      setExpenseCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadExpenseCategories();
  }, []);

  return { expenseCategories, isLoading, error, refetch: loadExpenseCategories };
}

export default useExpenseCategories;