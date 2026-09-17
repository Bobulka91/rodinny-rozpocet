/**
 * Formulář pro vytvoření/editaci příjmu.
 * Obsahuje i "+" u dropdownu zdroje - umožní vytvořit nový zdroj
 * přímo tady. Nově vytvořený zdroj appka přidá OKAMŽITĚ do lokálního
 * seznamu (localSources), aby <select> mohl hned zobrazit správnou
 * volbu - nečeká se na to, až rodič dokončí refetchAll().
 *
 * Když je otevřený mini formulář na novou šablonu (showNewSource),
 * zbytek formuláře (Částka/Datum/Uložit) se vizuálně ztlumí a deaktivuje -
 * uživatel tak jasně vidí, že právě dělá jinou akci (vytváří šablonu),
 * ne že zadává konkrétní příjem.
 */
import { useState, useEffect } from 'react';

function IncomeForm({ onSubmit, incomeSources, initialValues, onCreateSource }) {
  const [localSources, setLocalSources] = useState(incomeSources);
  const [sourceId, setSourceId] = useState(initialValues?.incomeSource?.id || incomeSources[0]?.id || '');
  const [amount, setAmount] = useState(initialValues?.amount ?? '');
  const [date, setDate] = useState(initialValues?.date || '');

  const [showNewSource, setShowNewSource] = useState(false); // je otevřený mini formulář na šablonu?
  const [newPerson, setNewPerson] = useState('');
  const [newLabel, setNewLabel] = useState('');

  // Když appka dokončí refetchAll (o pár set milisekund později), synchronizuje
  // localSources s aktuálním, čerstvým seznamem z Contextu
  useEffect(() => {
    setLocalSources(incomeSources);
  }, [incomeSources]);

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      amount: Number(amount),
      date,
      sourceId: Number(sourceId),
    });
  }

  async function handleCreateSource() {
    const newSource = await onCreateSource({ person: newPerson, label: newLabel });
    setLocalSources([...localSources, newSource]); // OKAMŽITÉ přidání do lokálního seznamu
    setSourceId(newSource.id); // teď <select> má na výběr option s tímhle ID hned
    setShowNewSource(false);
    setNewPerson('');
    setNewLabel('');
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Dropdown zdroje + tlačítko "+" - vždy aktivní, i když je otevřený mini formulář */}
      <label>Zdroj příjmu</label>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <select value={sourceId} onChange={(e) => setSourceId(e.target.value)} required style={{ flex: 1 }}>
          {localSources.map((source) => (
            <option key={source.id} value={source.id}>
              {source.person} - {source.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setShowNewSource(!showNewSource)}
          style={{
            width: '38px', height: '38px', borderRadius: '10px', border: '1.5px solid var(--indigo)',
            background: showNewSource ? 'var(--indigo)' : 'white',
            color: showNewSource ? 'white' : 'var(--indigo)',
            fontSize: '18px', fontWeight: 700, cursor: 'pointer', flexShrink: 0,
          }}
        >
          +
        </button>
      </div>

      {/* Mini formulář na novou šablonu - vizuálně oddělená "vyskakující" karta */}
     {showNewSource && (
          <div style={{
            background: 'linear-gradient(135deg, #f0edfc, #ffffff)', // jemný přechod, ne plochá bílá
            border: '2px solid var(--indigo)', // silnější okraj (2px místo 1.5px)
            borderRadius: '12px',
            padding: '14px',
            marginTop: '10px',
            marginBottom: '10px',
            boxShadow: '0 8px 24px -6px rgba(108, 99, 224, 0.5)', // výraznější, "vznášející se" stín
            transform: 'scale(1.02)', // jemné zvětšení - dojem, že to "vystupuje" dopředu
    }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--indigo)', marginBottom: '10px' }}>
            ➕ Nová šablona zdroje
          </div>

          <label style={{ fontSize: '0.7rem', color: '#6b7280', display: 'block', marginBottom: '2px' }}>Osoba</label>
          <input
            type="text"
            value={newPerson}
            onChange={(e) => setNewPerson(e.target.value)}
            placeholder="Já / Manželka"
            style={{ width: '100%', marginBottom: '8px' }}
          />

          <label style={{ fontSize: '0.7rem', color: '#6b7280', display: 'block', marginBottom: '2px' }}>Popisek</label>
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Výplata, Dýško..."
            style={{ width: '100%', marginBottom: '10px' }}
          />

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setShowNewSource(false)}
              style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #ccc', background: 'white', color: '#666', fontWeight: 600, cursor: 'pointer' }}
            >
              Zrušit
            </button>
            <button
              type="button"
              onClick={handleCreateSource}
              disabled={!newPerson || !newLabel}
              style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: 'var(--indigo)', color: 'white', fontWeight: 600, cursor: 'pointer', opacity: (!newPerson || !newLabel) ? 0.5 : 1 }}
            >
              Přidat
            </button>
          </div>
        </div>
      )}

      {/* Zbytek formuláře - ZTLUMENÝ a NEAKTIVNÍ, dokud je otevřený mini formulář na šablonu */}
      <div style={{
        opacity: showNewSource ? 0.3 : 1,
        pointerEvents: showNewSource ? 'none' : 'auto',
        transition: 'opacity 0.2s ease',
      }}>
        <label>Částka</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />

        <label>Datum</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

        <button type="submit" className="btn-submit">Uložit</button>
      </div>
    </form>
  );
}

export default IncomeForm;