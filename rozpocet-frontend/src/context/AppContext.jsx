/**
 * Globální stav appky (React Context).
 * Sjednocuje data ze všech hooků na jedno místo a zpřístupňuje je
 * kterémukoliv slidu bez nutnosti předávat props přes víc úrovní.
 */

import { createContext, useState, useEffect } from 'react';
import useExpense from '../hooks/useExpense';
import useIncome from '../hooks/useIncome';
import useSavingGoals from '../hooks/useSavingGoals';
import useDebts from '../hooks/useDebts';
import usePlans from '../hooks/usePlans';
import usePlanComparison from '../hooks/usePlanComparison';
import useExpenseCategories from '../hooks/useExpenseCategories';
import useIncomeSources from '../hooks/useIncomeSources';
import useExpensesByGroup from '../hooks/useExpensesByGroup';
import useIncomeByPerson from '../hooks/useIncomeByPerson';
import { generateFixedExpenses } from '../api/expenseApi';

export const AppContext = createContext();

/**
 * Provider komponenta - obaluje celou appku a poskytuje jí sdílený stav.
 * Volá všechny datové hooky a spojuje je do jednoho value objektu.
 */
export function AppProvider({ children }) {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1); // výchozí = aktuální měsíc, ne natvrdo napsaná hodnota
  const [selectedYear, setSelectedYear] = useState(today.getFullYear()); // výchozí = aktuální rok

  // Přejmenování isLoading/error při destructuringu - každý hook vrací
  // proměnnou se stejným jménem, museli bychom se jinak přepisovat navzájem
  const { expenses, isLoading: expensesLoading, error: expensesError, refetch: refetchExpenses } = useExpense();
  const { incomes, isLoading: incomesLoading, error: incomesError, refetch: refetchIncomes } = useIncome();
  const { savingGoals, isLoading: savingGoalsLoading, error: savingGoalsError, refetch: refetchSavingGoals } = useSavingGoals();
  const { debts, isLoading: debtsLoading, error: debtsError, refetch: refetchDebts } = useDebts();
  const { plans, isLoading: plansLoading, error: plansError, refetch: refetchPlans } = usePlans();

  // Trvalé šablony kategorií výdajů a zdrojů příjmů (pro dropdown ve formulářích)
  const { expenseCategories, isLoading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = useExpenseCategories();
  const { incomeSources, isLoading: sourcesLoading, error: sourcesError, refetch: refetchSources } = useIncomeSources();

  // Agregace počítané přímo na backendu - appka je NEPOČÍTÁ ručně z expenses/incomes,
  // jen je zobrazí (viz Slide 1)
  const { expensesByGroup, isLoading: groupLoading, error: groupError, refetch: refetchGroup } = useExpensesByGroup();
  const { incomeByPerson, isLoading: personLoading, error: personError, refetch: refetchPerson } = useIncomeByPerson();

  // usePlanComparison potřebuje plans (aby vyfiltroval relevantní) a vybrané období
  const { rows: planComparisonRows, isLoading: comparisonLoading } = usePlanComparison(
    plans,
    selectedMonth,
    selectedYear
  );

  // Appka je "stále načítající", dokud aspoň JEDEN z hooků nedokončil svůj request
  const isLoading = expensesLoading || incomesLoading || savingGoalsLoading || debtsLoading || plansLoading || categoriesLoading || sourcesLoading || groupLoading || personLoading;
  const error = expensesError || incomesError || savingGoalsError || debtsError || plansError || categoriesError || sourcesError || groupError || personError;

  /**
   * Znovu natáhne data ze všech hooků paralelně.
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
      refetchCategories(),
      refetchSources(),
      refetchGroup(),
      refetchPerson(),
    ]);
  }

  /**
   * Automaticky "zapíše" fixní náklady/předplatné pro nově vybraný měsíc,
   * ALE JEN pokud je vybraný měsíc dnešní nebo budoucí - appka nikdy
   * negeneruje nic při prohlížení historie (minulých měsíců).
   */
  useEffect(() => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // getMonth() vrací 0-11, appka potřebuje 1-12
    const currentYear = today.getFullYear();

    const isCurrentMonth = selectedYear === currentYear && selectedMonth === currentMonth;

      if (!isCurrentMonth) return; // appka jen prohlíží historii, nic nezapisuje

    async function autoGenerate() {
      await generateFixedExpenses(selectedYear, selectedMonth);
      await refetchAll();
    }
    autoGenerate();
  }, [selectedMonth, selectedYear]);

  // Objekt, co se přes Context.Provider zpřístupní všem slidům
  const value = {
    expenses,
    incomes,
    savingGoals,
    debts,
    plans,
    expenseCategories,
    incomeSources,
    expensesByGroup,
    incomeByPerson,
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