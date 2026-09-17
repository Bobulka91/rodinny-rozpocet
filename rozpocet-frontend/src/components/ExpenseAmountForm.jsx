/**
 * Jednoduchý formulář jen na úpravu částky a data KONKRÉTNÍHO výdaje
 * (ne šablony). Používá se, když chceš opravit, kolik appka skutečně
 * zaplatila v daném měsíci - třeba když byl nájem výjimečně jiný,
 * ale samotnou šablonu (budoucí cenu) měnit nechceš.
 */
import { useState } from 'react';

function ExpenseAmountForm({ onSubmit, initialValues }) {
  const [amount, setAmount] = useState(initialValues?.amount ?? '');
  const [date, setDate] = useState(initialValues?.date || '');

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ amount: Number(amount), date });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Částka</label>
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />

      <label>Datum</label>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

      <button type="submit" className="btn-submit">Uložit</button>
    </form>
  );
}

export default ExpenseAmountForm;