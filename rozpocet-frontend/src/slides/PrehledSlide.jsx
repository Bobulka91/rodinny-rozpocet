/**
 * Slide 1 - Přehled: čistě read-only snapshot stavu ZA VYBRANÝ MĚSÍC.
 * Statistiky, rozpis příjmu (podle osoby) vs výdajů (podle skupiny),
 * "Zbývá" po odečtení fixních nákladů a předplatného, a 4 donut grafy.
 *
 * Appka NEPOUŽÍVÁ backend agregace (expensesByGroup/incomeByPerson) -
 * ty appka počítá za celou historii bez filtru. Appka si místo toho
 * příjmy/výdaje sama přefiltruje podle vybraného měsíce/roku, stejným
 * principem jako appka dělá na Slide 2, 3 a 4.
 */
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import StatCard from '../components/StatCard';
import CategoryDonut from '../components/CategoryDonut';

const SKUPINA_FIXNI = 'Fixní náklady';
const SKUPINA_PREDPLATNE = 'Předplatné';

/** Ponechá jen záznamy s datem spadajícím do daného měsíce/roku. */
function filterByMonth(records, month, year) {
  return records.filter((r) => {
    const d = new Date(r.date);
    return d.getFullYear() === year && d.getMonth() + 1 === month;
  });
}

/** Sečte příjmy podle osoby (jen appka z už appka vyfiltrovaného pole). */
function buildIncomeBreakdown(monthlyIncomes) {
  const map = {};
  monthlyIncomes.forEach((i) => {
    if (!i.incomeSource) return;
    const person = i.incomeSource.person;
    map[person] = (map[person] || 0) + i.amount;
  });
  const total = Object.values(map).reduce((sum, v) => sum + v, 0);
  return Object.entries(map)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

/** Sečte výdaje podle skupiny (jen appka z už vyfiltrovaného pole). */
function buildExpenseBreakdown(monthlyExpenses) {
  const map = {};
  monthlyExpenses.forEach((e) => {
    if (!e.expenseCategory) return;
    const group = e.expenseCategory.categoryGroup;
    map[group] = (map[group] || 0) + e.amount;
  });
  const total = Object.values(map).reduce((sum, v) => sum + v, 0);
  return Object.entries(map)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

function PrehledSlide() {
  const { incomes, expenses, savingGoals, debts, selectedMonth, selectedYear, isLoading, error } = useContext(AppContext);

  if (isLoading) return <p style={{ color: 'white' }}>Načítám...</p>;
  if (error) return <p style={{ color: 'white' }}>Chyba: {error}</p>;

  // Vyfiltrujeme jen záznamy patřící do vybraného měsíce/roku
  const monthlyIncomes = filterByMonth(incomes, selectedMonth, selectedYear);
  const monthlyExpenses = filterByMonth(expenses, selectedMonth, selectedYear);

  const totalIncome = monthlyIncomes.reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalSaved = savingGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalDebtRemaining = debts.reduce((sum, d) => sum + (d.totalAmount - d.paidAmount), 0);
  const balance = totalIncome - totalExpense;

  const incomeBreakdown = buildIncomeBreakdown(monthlyIncomes);
  const expenseBreakdown = buildExpenseBreakdown(monthlyExpenses);

  // "Zbývá" bere jen Fixní náklady + Předplatné - ze stejné vyfiltrované skupiny
  const fixniTotal = expenseBreakdown.find((e) => e.category === SKUPINA_FIXNI)?.amount || 0;
  const predplatneTotal = expenseBreakdown.find((e) => e.category === SKUPINA_PREDPLATNE)?.amount || 0;
  const zbyva = totalIncome - fixniTotal - predplatneTotal;

  // Naspořeno a Dluh zůstávají "celkový" stav (appka nemá u appka nich smysl appka appka filtrovat podle měsíce -
  // je to appka appka aktuální appka zůstatek, ne transakce vázaná na datum appka)
  const savingsTotal = savingGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const savingsBreakdown = savingGoals
    .map((goal) => ({
      category: goal.category,
      amount: goal.currentAmount,
      percentage: savingsTotal > 0 ? Math.round((goal.currentAmount / savingsTotal) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const debtBreakdown = debts
    .map((debt) => ({ category: debt.category, amount: debt.totalAmount - debt.paidAmount }))
    .map((d) => ({
      ...d,
      percentage: totalDebtRemaining > 0 ? Math.round((d.amount / totalDebtRemaining) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="slide">
      <div className="eyebrow">Sekce</div>
      <h2 className="section-title">Přehled ({selectedMonth}/{selectedYear})</h2>

      <div className="glass-card stats-bar">
        <StatCard label="Příjem" amount={`${totalIncome} Kč`} variant="income" />
        <StatCard label="Výdaj" amount={`${totalExpense} Kč`} variant="expense" />
        <StatCard label="Naspořeno" amount={`${totalSaved} Kč`} variant="" />
        <StatCard label="Bilance" amount={`${balance} Kč`} variant="balance" />
      </div>

      <div className="section-label">Rozpis</div>
      <div className="glass-card" style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <strong style={{ fontSize: '0.75rem', color: '#6b7280' }}>PŘÍJEM PODLE OSOBY</strong>
          {incomeBreakdown.length === 0 && <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Žádné příjmy</p>}
          {incomeBreakdown.map((item) => (
            <div key={item.category} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '4px 0' }}>
              <span>{item.category}</span>
              <span>{item.amount} Kč</span>
            </div>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <strong style={{ fontSize: '0.75rem', color: '#6b7280' }}>VÝDAJE PODLE SKUPINY</strong>
          {expenseBreakdown.length === 0 && <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Žádné výdaje</p>}
          {expenseBreakdown.map((item) => (
            <div key={item.category} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '4px 0' }}>
              <span>{item.category}</span>
              <span>{item.amount} Kč</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>Zbývá</div>
        <div style={{ fontSize: '1.8rem', fontWeight: 700, color: zbyva >= 0 ? '#10b981' : '#C24BA0' }}>
          {zbyva} Kč
        </div>
      </div>

      <div className="section-label">Rozklad podle skupin</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        <div className="glass-card" style={{ flex: '1 1 45%' }}>
          <strong style={{ fontSize: '0.75rem' }}>Příjem</strong>
          <CategoryDonut segments={incomeBreakdown} />
        </div>
        <div className="glass-card" style={{ flex: '1 1 45%' }}>
          <strong style={{ fontSize: '0.75rem' }}>Výdaje</strong>
          <CategoryDonut segments={expenseBreakdown} />
        </div>
        <div className="glass-card" style={{ flex: '1 1 45%' }}>
          <strong style={{ fontSize: '0.75rem' }}>Naspořeno</strong>
          <CategoryDonut segments={savingsBreakdown} />
        </div>
        <div className="glass-card" style={{ flex: '1 1 45%' }}>
          <strong style={{ fontSize: '0.75rem' }}>Dluh</strong>
          <CategoryDonut segments={debtBreakdown} />
        </div>
      </div>
    </div>
  );
}

export default PrehledSlide;