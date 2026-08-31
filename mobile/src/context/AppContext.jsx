/**
 * Globální stav appky (React Context).
 * Sjednocuje data ze všech 5 hooků na jedno místo a zpřístupňuje je
 * kterémukoliv slidu bez nutnosti předávat props přes víc úrovní.
 */

import { createContext, useState } from 'react';
import useExpense from '../hooks/useExpense';
import useIncome from '../hooks/useIncome';
import useSavingGoals from '../hooks/useSavingGoals';
import useDebts from '../hooks/useDebts';
import usePlans from '../hooks/usePlans';
import usePlanComparison from '../hooks/usePlanComparison';

export const AppContext = createContext();

/**
 * Provider komponenta - obaluje celou appku a poskytuje jí sdílený stav.
 * Volá všech 5 datových hooků a spojuje je do jednoho value objektu.
 */
export function AppProvider({ children }) {
  const [selectedMonth, setSelectedMonth] = useState(7); // aktuálně vybraný měsíc (PlanSelector)
  const [selectedYear, setSelectedYear] = useState(2026); // aktuálně vybraný rok (PlanSelector)

  // Přejmenování isLoading/error při destructuringu - každý hook vrací
  // proměnnou se stejným jménem, museli bychom se jinak přepisovat navzájem
  const { expenses, isLoading: expensesLoading, error: expensesError, refetch: refetchExpenses } = useExpense();
  const { incomes, isLoading: incomesLoading, error: incomesError, refetch: refetchIncomes } = useIncome();
  const { savingGoals, isLoading: savingGoalsLoading, error: savingGoalsError, refetch: refetchSavingGoals } = useSavingGoals();
  const { debts, isLoading: debtsLoading, error: debtsError, refetch: refetchDebts } = useDebts();
  const { plans, isLoading: plansLoading, error: plansError, refetch: refetchPlans } = usePlans();

  // usePlanComparison potřebuje plans (aby vyfiltroval relevantní) a vybrané období
  const { rows: planComparisonRows, isLoading: comparisonLoading } = usePlanComparison(
    plans,
    selectedMonth,
    selectedYear
  );

  // Appka je "stále načítající", dokud aspoň JEDEN z 5 hooků nedokončil svůj request
  const isLoading = expensesLoading || incomesLoading || savingGoalsLoading || debtsLoading || plansLoading;
  const error = expensesError || incomesError || savingGoalsError || debtsError || plansError;

  /**
   * Znovu natáhne data ze všech 5 hooků paralelně.
   * Volá se po každé CRUD akci (přidání/úprava/smazání), ať appka
   * zobrazí čerstvá data bez tvrdého reloadu celé stránky.
   */
  async function refetchAll() {
    await Promise.all([
      refetchExpenses(),
      refetchIncomes(),
      refetchSavingGoals(),
      refetchDebts(),
      refetchPlans(),
    ]);
  }

  // Objekt, co se přes Context.Provider zpřístupní všem slidům
  const value = {
    expenses,
    incomes,
    savingGoals,
    debts,
    plans,
    planComparisonRows,
    comparisonLoading,
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
    isLoading,
    error,
    refetchAll,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}