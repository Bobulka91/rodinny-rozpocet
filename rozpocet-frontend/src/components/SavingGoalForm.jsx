/**
 * Formulář pro vytvoření/editaci cíle spoření.
 * initialValues (pokud existuje) předvyplní pole pro editaci.
 */
import { useState } from 'react';

function SavingGoalForm({ onSubmit, initialValues }) {
  const [category, setCategory] = useState(initialValues?.category || '');
  const [targetAmount, setTargetAmount] = useState(initialValues?.targetAmount ?? '');
  const [currentAmount, setCurrentAmount] = useState(initialValues?.currentAmount ?? '');

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      category,
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount),
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Název cíle</label>
      <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="např. Dovolená" required />

      <label>Cílová částka</label>
      <input type="number" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} required />

      <label>Aktuálně naspořeno</label>
      <input type="number" value={currentAmount} onChange={(e) => setCurrentAmount(e.target.value)} required />

      <button type="submit" className="btn-submit">Uložit</button>
    </form>
  );
}

export default SavingGoalForm;