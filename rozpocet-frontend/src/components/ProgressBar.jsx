/**
 * Pruh s procenty pro cíle spoření a dluhy.
 * current/target jsou čísla (Kč) - procento se počítá tady, appka
 * ho nikde neukládá do databáze.
 */
function ProgressBar({ label, current, target, onDelete, onEdit, onHistory }) {
  const percentage = (current / target) * 100; // % naplnění cíle/splacení dluhu

  return (
    <div className="goal">
      <div className="goal-name">
        <span>{label}</span>
        <div className="goal-right">
          <span>{current} / {target} Kč</span>
          {/* Tlačítka na editaci/mazání/historii se zobrazí jen, když je rodič pošle jako prop */}
          {onHistory && (
            <button className="btn-edit" onPointerDown={(e) => e.stopPropagation()} onClick={onHistory}>
              📜
            </button>
          )}
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
      <div className="bar-bg">
        <div className="bar-fill" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}

export default ProgressBar;