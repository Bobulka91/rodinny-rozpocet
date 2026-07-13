/**
 * Malá statistika (např. "Příjem: +48 200 Kč") v top liště appky.
 * variant určuje barvu čísla přes CSS třídu (income/expense/balance).
 */
function StatCard({ label, amount, variant }) {
  return (
    <div className={`stat-col ${variant}`}>
      <span className="label">{label}</span>
      <span className="value">{amount}</span>
    </div>
  );
}

export default StatCard;