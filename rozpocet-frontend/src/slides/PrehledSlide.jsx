/**
 * Slide 1 - Přehled: souhrnné statistiky, tabulka Plán vs. skutečnost
 * a donut graf výdajů podle kategorií.
 */
import { useContext } from 'react'; // hook pro čtení dat z Contextu
import { AppContext } from '../context/AppContext'; // sdílený stav appky
import StatCard from '../components/StatCard'; // malá statistika (Příjem/Výdaje/Bilance)
import PlanComparisonTable from '../components/PlanComparisonTable'; // tabulka Plán vs. skutečnost
import CategoryDonut from '../components/CategoryDonut'; // donut graf výdajů podle kategorie
import { colorForCategory } from '../utils/colors'; // funkce přiřazující barvu podle názvu kategorie

/**
 * Sečte výdaje podle kategorie a spočítá procentuální podíl každé z nich
 * na celkových výdajích - připraví data přesně ve tvaru, co čeká CategoryDonut.
 */
function buildCategoryBreakdown(expenses) {
  const map = {}; // "slovník" - klíč je název kategorie, hodnota je součet Kč
  expenses.forEach((e) => {
    map[e.category] = (map[e.category] || 0) + e.amount; // pokud kategorie ještě není ve slovníku, začni od 0
  });
  const total = Object.values(map).reduce((sum, v) => sum + v, 0); // celkový součet přes všechny kategorie

  return Object.entries(map) // [ [kategorie, částka], ... ] pole dvojic
    .map(([category, amount]) => ({
      category,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0, // ošetření dělení nulou
      color: colorForCategory(category),
    }))
    .sort((a, b) => b.percentage - a.percentage); // seřazení od největšího podílu
}

function PrehledSlide() {
  // Data z Contextu - nemusíme je natahovat znovu, appka je má už centrálně
  const { expenses, incomes, savingGoals, planComparisonRows, isLoading, error } = useContext(AppContext);

  if (isLoading) return <p style={{ color: 'white' }}>Načítám...</p>; // zatímco data ještě nedorazila
  if (error) return <p style={{ color: 'white' }}>Chyba: {error}</p>; // pokud request selhal

  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0); // součet všech příjmů
  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0); // součet všech výdajů
  const balance = totalIncome - totalExpense; // kolik zbylo/přebylo
  const totalSaved = savingGoals.reduce((sum, goal) => sum + goal.currentAmount, 0); // součet naspořeného napříč všemi cíli

  // Souhrnný "Celkem" řádek pro tabulku - sečte plán/skutečnost/rozdíl
  // napříč všemi kategoriemi z planComparisonRows
  const totalRow = {
    category: 'Celkem',
    planned: planComparisonRows.reduce((s, r) => s + r.planned, 0), // součet plánovaných částek
    actual: planComparisonRows.reduce((s, r) => s + r.actual, 0), // součet skutečných částek
    difference: planComparisonRows.reduce((s, r) => s + r.difference, 0), // součet rozdílů
    isTotal: true, // příznak pro PlanComparisonTable, ať tenhle řádek zvýrazní a schová tlačítka
  };
  // Total řádek přidáme jen, pokud vůbec nějaké plány existují (jinak by bylo "Celkem: 0" zbytečně)
  const rowsWithTotal = planComparisonRows.length > 0 ? [...planComparisonRows, totalRow] : [];

  const categoryBreakdown = buildCategoryBreakdown(expenses); // data pro donut graf

  return (
    <div className="slide">
      <div className="eyebrow">Sekce</div>
      <h2 className="section-title">Přehled</h2>

      {/* Souhrnné statistiky v jedné kartě, 4 sloupce vedle sebe */}
      <div className="glass-card stats-bar">
        <StatCard label="Příjmy" amount={`${totalIncome} Kč`} variant="income" />
        <StatCard label="Výdaje" amount={`${totalExpense} Kč`} variant="expense" />
        <StatCard label="Naspořeno" amount={`${totalSaved} Kč`} variant="" />
        <StatCard label="Bilance" amount={`${balance} Kč`} variant="balance" />
      </div>

      <div className="section-label">Plán vs. skutečnost</div>
      <div className="glass-card">
        <PlanComparisonTable rows={rowsWithTotal} />
      </div>

      <div className="section-label">Výdaje podle kategorií</div>
      <div className="glass-card">
        <CategoryDonut segments={categoryBreakdown} centerLabel="Moje Bilance" />
      </div>
    </div>
  );
}

export default PrehledSlide;