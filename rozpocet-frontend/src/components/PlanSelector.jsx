import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const months = [
  'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
  'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec',
];

/**
 * Vygeneruje seznam let kolem aktuálního roku, ať appka nikdy "nedojde" -
 * není potřeba každý rok ručně přidávat novou <option> do kódu.
 * Rozsah: 2 roky zpátky (historie) až 3 roky dopředu (plánování dopředu).
 */
function generateYearRange() {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear - 2; y <= currentYear + 3; y++) {
    years.push(y);
  }
  return years;
}

function PlanSelector() {
  const { selectedMonth, selectedYear, setSelectedMonth, setSelectedYear } = useContext(AppContext);
  const years = generateYearRange(); // spočítá se znovu při každém renderu - je to jen pár čísel, žádná zátěž

  return (
    <div className="plan-selector" onPointerDown={(e) => e.stopPropagation()}>
      <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
        {months.map((name, index) => (
          <option key={index} value={index + 1}>{name}</option>
        ))}
      </select>
      <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
        {years.map((year) => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>
  );
}

export default PlanSelector;