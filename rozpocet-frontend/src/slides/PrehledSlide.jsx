/**
 * Slide 1 - Přehled: čistě read-only snapshot celkového stavu.
 * Statistiky, rozpis příjmu (podle osoby) vs výdajů (podle skupiny),
 * "Zbývá" po odečtení fixních nákladů a předplatného, a 4 donut grafy.
 * Agregace (expensesByGroup, incomeByPerson) počítá backend, appka je jen zobrazuje.
 */
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import StatCard from '../components/StatCard';
import CategoryDonut from '../components/CategoryDonut';

// Přesné názvy skupin, jak je appka očekává v expensesByGroup
const SKUPINA_FIXNI = 'Fixní náklady';
const SKUPINA_PREDPLATNE = 'Předplatné';

/**
 * Převede objekt { klíč: hodnota } (jak appka dostává z backendu) na pole
 * { category, amount, percentage } - tvar, co čeká CategoryDonut komponenta.
 */
function objectToBreakdown(obj) {
  const total = Object.values(obj).reduce((sum, v) => sum + v, 0);
  return Object.entries(obj)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

function PrehledSlide() {
  const { savingGoals, debts, expensesByGroup, incomeByPerson, isLoading, error } = useContext(AppContext);

  if (isLoading) return <p style={{ color: 'white' }}>Načítám...</p>;
  if (error) return <p style={{ color: 'white' }}>Chyba: {error}</p>;

  // Součty počítáme z agregovaných dat, ne z jednotlivých záznamů
  const totalIncome = Object.values(incomeByPerson).reduce((sum, v) => sum + v, 0);
  const totalExpense = Object.values(expensesByGroup).reduce((sum, v) => sum + v, 0);
  const totalSaved = savingGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalDebtRemaining = debts.reduce((sum, d) => sum + (d.totalAmount - d.paidAmount), 0);
  const balance = totalIncome - totalExpense;

  // "Zbývá" bere jen Fixní náklady + Předplatné ze skupinové agregace
  const fixniTotal = expensesByGroup[SKUPINA_FIXNI] || 0;
  const predplatneTotal = expensesByGroup[SKUPINA_PREDPLATNE] || 0;
  const zbyva = totalIncome - fixniTotal - predplatneTotal;

  const incomeBreakdown = objectToBreakdown(incomeByPerson);
  const expenseBreakdown = objectToBreakdown(expensesByGroup);

  // Naspořeno a Dluh zatím počítáme z jednotlivých záznamů (backend pro tohle
  // agregaci nemá - je jich obvykle jen pár, takže výkonově to nevadí)
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
      <h2 className="section-title">Přehled</h2>

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
          {incomeBreakdown.map((item) => (
            <div key={item.category} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '4px 0' }}>
              <span>{item.category}</span>
              <span>{item.amount} Kč</span>
            </div>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <strong style={{ fontSize: '0.75rem', color: '#6b7280' }}>VÝDAJE PODLE SKUPINY</strong>
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