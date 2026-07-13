/**
 * Formulář pro vytvoření/editaci dluhu.
 * initialValues (pokud existuje) předvyplní pole pro editaci.
 */
import { useState } from 'react';

function DebtForm({ onSubmit, initialValues }) {
  const [category, setCategory] = useState(initialValues?.category || '');
  const [totalAmount, setTotalAmount] = useState(initialValues?.totalAmount ?? '');
  const [paidAmount, setPaidAmount] = useState(initialValues?.paidAmount ?? '');

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      category,
      totalAmount: Number(totalAmount),
      paidAmount: Number(paidAmount),
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Název dluhu</label>
      <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="např. Hypotéka" required />

      <label>Celková výše</label>
      <input type="number" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} required />

      <label>Již splaceno</label>
      <input type="number" value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} required />

      <button type="submit" className="btn-submit">Uložit</button>
    </form>
  );
}

export default DebtForm;