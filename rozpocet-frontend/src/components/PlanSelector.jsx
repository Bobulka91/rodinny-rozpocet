import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const months = [
  'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
  'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec',
];

function PlanSelector() {
  const { selectedMonth, selectedYear, setSelectedMonth, setSelectedYear } = useContext(AppContext);

  return (
    <div className="plan-selector" onPointerDown={(e) => e.stopPropagation()}>
      <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
        {months.map((name, index) => (
          <option key={index} value={index + 1}>{name}</option>
        ))}
      </select>
      <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
        <option value={2025}>2025</option>
        <option value={2026}>2026</option>
        <option value={2027}>2027</option>
      </select>
    </div>
  );
}

export default PlanSelector;