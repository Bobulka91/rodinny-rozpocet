/**
 * Formulář pro vytvoření/editaci plánu (kategorie + plánovaná částka
 * pro konkrétní měsíc/rok). initialValues předvyplní pole pro editaci.
 */
import { useState } from 'react';

const months = [
  'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
  'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec',
]; // mimo komponentu - statická data, nemá smysl vytvářet znovu při každém překreslení

function PlanForm({ onSubmit, initialValues }) {
  const [category, setCategory] = useState(initialValues?.category || '');
  const [plannedAmount, setPlannedAmount] = useState(initialValues?.plannedAmount ?? '');
  const [month, setMonth] = useState(initialValues?.month || 7);
  const [year, setYear] = useState(initialValues?.year || 2026);

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      category,
      plannedAmount: Number(plannedAmount),
      month: Number(month),
      year: Number(year),
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Kategorie</label>
      <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="např. Jídlo" required />

      <label>Plánovaná částka</label>
      <input type="number" value={plannedAmount} onChange={(e) => setPlannedAmount(e.target.value)} required />

      <label>Měsíc</label>
      <select value={month} onChange={(e) => setMonth(e.target.value)}>
        {months.map((name, index) => (
          <option key={index} value={index + 1}>{name}</option>
        ))}
      </select>

      <label>Rok</label>
      <input type="number" value={year} onChange={(e) => setYear(e.target.value)} required />

      <button type="submit" className="btn-submit">Uložit</button>
    </form>
  );
}

export default PlanForm;