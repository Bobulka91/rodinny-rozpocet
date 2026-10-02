/**
 * Formulář pro vytvoření nové trvalé šablony zdroje příjmu
 * (např. "Já - Výplata", "Manželka - Dýško"). Jednou vytvořený
 * zdroj appka nabízí v dropdownu při zadávání konkrétních příjmů.
 */
import { useState } from 'react';

function IncomeSourceForm({ onSubmit, initialValues }) {
  const [person, setPerson] = useState(initialValues?.person || '');
  const [label, setLabel] = useState(initialValues?.label || '');

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ person, label });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Osoba</label>
      <input type="text" value={person} onChange={(e) => setPerson(e.target.value)} placeholder="Já / Manželka" required />

      <label>Popisek zdroje</label>
      <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Výplata, Dýško..." required />

      <button type="submit" className="btn-submit">Uložit</button>
    </form>
  );
}

export default IncomeSourceForm;