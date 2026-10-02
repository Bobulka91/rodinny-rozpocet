/**
 * Zjednodušený formulář jen na název kategorie výdajů typu PROMENLIVA
 * (Každodenní výdaje). Žádné pole na částku - appka u proměnlivých
 * kategorií žádnou pevnou cenu nepamatuje.
 */
import { useState } from 'react';

function ExpenseCategoryLabelForm({ onSubmit, initialValues }) {
  const [label, setLabel] = useState(initialValues?.label || '');

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ label });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Název kategorie</label>
      <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="např. Kafe" required />

      <button type="submit" className="btn-submit">Uložit</button>
    </form>
  );
}

export default ExpenseCategoryLabelForm;