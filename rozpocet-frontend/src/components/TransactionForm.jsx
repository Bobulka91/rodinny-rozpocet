/**
 * Formulář pro Income i Expense najednou (přepínač typu nahoře).
 * initialValues (pokud existuje) předvyplní pole pro editaci existující
 * transakce - jinak formulář slouží k vytvoření nové.
 */
import { useState } from 'react';

function TransactionForm({ onSubmit, initialValues }) {
  const [type, setType] = useState(initialValues?.type || 'expense');
  const [amount, setAmount] = useState(initialValues?.amount ?? ''); // ?? místo || - 0 je platná hodnota
  const [date, setDate] = useState(initialValues?.date || '');
  const [category, setCategory] = useState(initialValues?.category || initialValues?.source || ''); // Income používá source, Expense category

  function handleSubmit(e) {
    e.preventDefault(); // zabrání výchozímu reloadu stránky při odeslání formuláře
    onSubmit({
      type,
      amount: Number(amount), // input vrací text, backend čeká číslo
      date,
      category,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-tabs">
        {/* type="button" - jinak by kliknutí na tab omylem odeslalo formulář */}
        <button type="button" className={type === 'expense' ? 'active' : ''} onClick={() => setType('expense')}>
          Výdaj
        </button>
        <button type="button" className={type === 'income' ? 'active' : ''} onClick={() => setType('income')}>
          Příjem
        </button>
      </div>

      <label>Částka</label>
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />

      <label>Datum</label>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

      <label>Kategorie</label>
      <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />

      <button type="submit" className="btn-submit">Uložit</button>
    </form>
  );
}

export default TransactionForm;