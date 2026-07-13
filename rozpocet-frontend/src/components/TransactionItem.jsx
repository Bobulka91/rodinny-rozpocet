/**
 * Jeden řádek transakce v seznamu příjmů/výdajů.
 * type ("income"/"expense") určuje barvu částky a znaménko (+/-).
 */
function TransactionItem({ icon, name, date, amount, type, onDelete, onEdit }) {
  const amountColor = type === 'income' ? 'var(--ok)' : 'var(--neg)'; // zelená pro příjem, růžová pro výdaj
  const sign = type === 'income' ? '+' : '−';

  return (
    <div className="txn">
      <div className="txn-left">
        <div className="icon-chip">{icon}</div>
        <div>
          <div className="txn-name">{name}</div>
          <div className="txn-date">{date}</div>
        </div>
      </div>
      <div className="txn-right">
        <div className="txn-amt" style={{ color: amountColor }}>
          {sign}{amount} Kč
        </div>
        {/* onPointerDown se stopPropagation zabrání, aby klik na tlačítko
            spustil jakékoliv gesto/navigaci na rodičovském elementu */}
        {onEdit && (
          <button className="btn-edit" onPointerDown={(e) => e.stopPropagation()} onClick={onEdit}>
            ✏️
          </button>
        )}
        {onDelete && (
          <button className="btn-delete" onPointerDown={(e) => e.stopPropagation()} onClick={onDelete}>
            🗑
          </button>
        )}
      </div>
    </div>
  );
}

export default TransactionItem;