/**
 * Custom hook pro natažení a správu dat o zdrojích příjmů (trvalé šablony).
 * Stejný vzor jako ostatní datové hooky (isLoading/error/refetch).
 */
import { useState, useEffect } from 'react';
import { getAllIncomeSources } from '../api/incomeSourceApi';

/**
 * Natáhne zdroje příjmů z backendu a udrží je v Reactu.
 * Vrací data, stav načítání, případnou chybu, a funkci refetch.
 */
function useIncomeSources() {
  const [incomeSources, setIncomeSources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadIncomeSources() {
    try {
      setIsLoading(true);
      const data = await getAllIncomeSources();
      setIncomeSources(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadIncomeSources();
  }, []);

  return { incomeSources, isLoading, error, refetch: loadIncomeSources };
}

export default useIncomeSources;