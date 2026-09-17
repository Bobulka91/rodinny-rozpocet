/**
 * Custom hook pro natažení sumy příjmů podle osoby (Já, Manželka...).
 * Na rozdíl od ostatních hooků vrací Map<String, Double>, ne pole objektů.
 */
import { useState, useEffect } from 'react';
import { getIncomeByPerson } from '../api/incomeApi';

/**
 * Natáhne sumy příjmů po osobách z backendu.
 * Vrací data (objekt {osoba: částka}), stav načítání, chybu, refetch.
 */
function useIncomeByPerson() {
  const [incomeByPerson, setIncomeByPerson] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadIncomeByPerson() {
    try {
      setIsLoading(true);
      const data = await getIncomeByPerson();
      setIncomeByPerson(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadIncomeByPerson();
  }, []);

  return { incomeByPerson, isLoading, error, refetch: loadIncomeByPerson };
}

export default useIncomeByPerson;