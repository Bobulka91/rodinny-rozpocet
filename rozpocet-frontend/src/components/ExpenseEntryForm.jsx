/**
 * Formulář pro vytvoření/editaci jednotlivé útraty (Expense) v rámci
 * skupiny "Každodenní výdaje". Stejný princip jako IncomeForm na Slide 2 -
 * dropdown vybírá existující kategorii, "+" umožní vytvořit novou
 * kategorii za pochodu, bez opuštění formuláře.
 */
import { useState, useEffect } from 'react';

function ExpenseEntryForm({ onSubmit, categories, initialValues, onCreateCategory }) {
  const [localCategories, setLocalCategories] = useState(categories);
  const [categoryId, setCategoryId] = useState(initialValues?.expenseCategory?.id || categories[0]?.id || '');
  const [amount, setAmount] = useState(initialValues?.amount ?? '');
  const [date, setDate] = useState(initialValues?.date || '');

  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newLabel, setNewLabel] = useState('');

  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      amount: Number(amount),
      date,
      categoryId: Number(categoryId),
    });
  }

  async function handleCreateCategory() {
    const newCategory = await onCreateCategory({ label: newLabel });
    setLocalCategories([...localCategories, newCategory]);
    setCategoryId(newCategory.id);
    setShowNewCategory(false);
    setNewLabel('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Kategorie</label>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required style={{ flex: 1 }}>
          {localCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.label}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setShowNewCategory(!showNewCategory)}
          style={{
            width: '38px', height: '38px', borderRadius: '10px', border: '1.5px solid var(--indigo)',
            background: showNewCategory ? 'var(--indigo)' : 'white',
            color: showNewCategory ? 'white' : 'var(--indigo)',
            fontSize: '18px', fontWeight: 700, cursor: 'pointer', flexShrink: 0,
          }}
        >
          +
        </button>
      </div>

      {showNewCategory && (
        <div style={{
          background: 'linear-gradient(135deg, #f0edfc, #ffffff)',
          border: '2px solid var(--indigo)',
          borderRadius: '14px',
          padding: '16px',
          marginTop: '10px',
          marginBottom: '10px',
          boxShadow: '0 8px 24px -6px rgba(108, 99, 224, 0.5)',
        }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--indigo)', marginBottom: '10px' }}>
            ➕ Nová kategorie
          </div>
          <label style={{ fontSize: '0.7rem', color: '#6b7280', display: 'block', marginBottom: '2px' }}>Název</label>
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
            placeholder="např. Kafe"
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" onClick={() => setShowNewCategory(false)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #ccc', background: 'white', color: '#666', fontWeight: 600, cursor: 'pointer' }}>
              Zrušit
            </button>
            <button type="button" onClick={handleCreateCategory} disabled={!newLabel} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: 'var(--indigo)', color: 'white', fontWeight: 600, cursor: 'pointer', opacity: !newLabel ? 0.5 : 1 }}>
              Přidat
            </button>
          </div>
        </div>
      )}

      <div style={{
        opacity: showNewCategory ? 0.3 : 1,
        pointerEvents: showNewCategory ? 'none' : 'auto',
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

export default ExpenseEntryForm;