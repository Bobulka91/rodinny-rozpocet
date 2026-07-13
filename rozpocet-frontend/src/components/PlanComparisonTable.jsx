/**
 * Tabulka Plán vs. skutečnost - zobrazuje výsledek Plan.compareToActual()
 * z backendu. Poslední řádek (isTotal) je souhrn napříč kategoriemi,
 * bez tlačítek na editaci/mazání (total se sám o sobě neupravuje).
 */
function PlanComparisonTable({ rows, onDelete, onEdit }) {
  return (
    <table className="budget-table">
      <thead>
        <tr>
          <th>Kategorie</th>
          <th className="num">Plán.</th>
          <th className="num">Skut.</th>
          <th className="num">Rozdíl</th>
          {(onDelete || onEdit) && <th></th>}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.category} className={row.isTotal ? 'total' : ''}>
            <td><strong>{row.category}</strong></td>
            <td className="num">{row.planned}</td>
            <td className="num">{row.actual}</td>
            {/* Barva/pozadí buňky podle znaménka rozdílu - total řádek zůstává neutrální */}
            <td className={`num ${row.isTotal ? '' : row.difference >= 0 ? 'diff-positive' : 'diff-negative'}`}>
              {row.difference >= 0 ? '+' : ''}{row.difference}
            </td>
            {/* Tlačítka na editaci/mazání se nezobrazí u total řádku */}
            {(onDelete || onEdit) && !row.isTotal && (
              <td className="table-actions">
                {onEdit && <button className="btn-edit" onPointerDown={(e) => e.stopPropagation()} onClick={() => onEdit(row)}>✏️</button>}
                {onDelete && <button className="btn-delete" onPointerDown={(e) => e.stopPropagation()} onClick={() => onDelete(row)}>🗑</button>}
              </td>
            )}
            {(onDelete || onEdit) && row.isTotal && <td></td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PlanComparisonTable;