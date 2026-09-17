/**
 * Formulář pro vytvoření/editaci šablony výdajové kategorie
 * (např. "Nájem" ve skupině Fixní náklady).
 *
 * categoryGroup a type appka dostává jako "pevné" hodnoty zvenčí (props),
 * ne jako pole k vyplnění - protože tenhle formulář je vždycky vyvolaný
 * z konkrétního slidu (Fixní náklady/Předplatné/Denní výdaje), který
 * už ví, do jaké skupiny a jakého typu kategorie patří. Je to podobné,
 * jako když jdeš do konkrétní prodejny - appka "ví", co se tam prodává,
 * nemusíš to specifikovat pokaždé znovu.
 */
import { useState } from 'react';

function ExpenseCategoryForm({ onSubmit, initialValues, categoryGroup, type }) {
  const [label, setLabel] = useState(initialValues?.label || '');
  const [amount, setAmount] = useState(initialValues?.amount ?? '');

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      categoryGroup,
      label,
      type,
      amount: Number(amount),
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Název položky</label>
      <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="např. Nájem" required />

      <label>Částka</label>
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />

      <button type="submit" className="btn-submit">Uložit</button>
    </form>
  );
}

export default ExpenseCategoryForm;