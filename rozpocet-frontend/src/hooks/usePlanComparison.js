/**
 * Hook pro porovnání Plán vs. skutečnost pro vybraný měsíc/rok.
 * Na rozdíl od ostatních hooků potřebuje vstupní parametry (plans, month, year),
 * protože Plan má vždy vazbu na konkrétní kategorii+měsíc+rok, ne obecná data.
 */

import { useState, useEffect } from 'react';
import { comparePlan } from '../api/planApi';

/**
 * Spočítá porovnání Plán vs. skutečnost pro vybraný měsíc/rok.
 * Vrací hotové řádky pro tabulku (kategorie, planned, actual, difference),
 * stav načítání a případnou chybu.
 */
function usePlanComparison(plans, month, year) {
  const [rows, setRows] = useState([]); // finální řádky pro tabulku Plán vs. skutečnost
  const [isLoading, setIsLoading] = useState(true); // stav načítání
  const [error, setError] = useState(null); // chybová zpráva

  useEffect(() => {
    /**
     * Vyfiltruje relevantní plány pro vybrané období, zavolá compare()
     * pro každý z nich paralelně, a spojí výsledky s id/category plánu.
     */
    async function loadComparisons() {
      try {
        setIsLoading(true); // start výpočtu

        // vyfiltrujeme jen plány, co patří k aktuálně vybranému měsíci/roku
        const relevantPlans = plans.filter((p) => p.month === month && p.year === year);

        // paralelní volání compare() pro každý relevantní plán najednou,
        // ne postupně jeden po druhém - šetří to čas
        const results = await Promise.all(
          relevantPlans.map((plan) => comparePlan(plan.id))
        );

        // spojíme výsledek z compare() (planned/actual/difference)
        // s id a category z původního plánu, protože compare() sám
        // tyhle dvě pole nevrací
        const combinedRows = relevantPlans.map((plan, index) => ({
          id: plan.id,
          category: plan.category,
          planned: results[index].planned,
          actual: results[index].actual,
          difference: results[index].difference,
        }));

        setRows(combinedRows); // uložení hotových řádků pro tabulku
      } catch (err) {
        setError(err.message); // zachycení chyby z kteréhokoliv volání výše
      } finally {
        setIsLoading(false); // konec výpočtu, ať dopadl jakkoliv
      }
    }

    if (plans.length > 0) {
      loadComparisons(); // spustí se, jen když existují nějaké plány k porovnání
    } else {
      setIsLoading(false); // žádné plány = není co počítat, rovnou ukonči loading
    }
  }, [plans, month, year]); // přepočítá se při změně měsíce/roku, ne jen jednou při startu

  return { rows, isLoading, error };
}

export default usePlanComparison;