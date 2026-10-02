/**
 * Modal s historií jednotlivých vkladů/splátek pro JEDEN konkrétní cíl spoření
 * nebo dluh. Použitý na Slide 5 pro obojí - SavingGoal i Debt - protože obě
 * appka řeší stejným principem (přidej záznam, appka upraví součet, zobraz historii).
 *
 * allowNegativeAmount: true u spoření (výběr/oprava), false u dluhu (appka
 * tam nechce zápornou splátku - validaci stejně hlídá i backend).
 */
import { useState } from 'react';
import Modal from './Modal';

function ContributionHistoryModal({ isOpen, onClose, title, items, onAdd, onDelete, allowNegativeAmount }) {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); // dnešní datum ve formátu YYYY-MM-DD
  const [note, setNote] = useState('');

  // Historie seřazená od nejnovějšího, ať je poslední přidaný záznam nahoře
  const sortedItems = [...items].sort((a, b) => new Date(b.date) - new Date(a.date));

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await onAdd({ amount: Number(amount), date, note: note || null });
      // Vyčistí formulář po úspěšném přidání, appka zůstává v modalu pro další záznam
      setAmount('');
      setNote('');
    } catch (err) {
      alert('Nepodařilo se přidat záznam - zkontroluj zadanou částku.');
    }
  }

  async function handleDelete(id) {
    try {
      await onDelete(id);
    } catch (err) {
      alert('Nepodařilo se smazat záznam.');
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit}>
        <label>Částka {allowNegativeAmount ? '(záporná = výběr)' : ''}</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <label>Datum</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

        <label>Poznámka (volitelné)</label>
        <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="např. vklad spoření auto" />

        <button type="submit" className="btn-submit">Přidat</button>
      </form>

      <div className="section-label" style={{ marginTop: '16px' }}>Historie</div>
      {sortedItems.length === 0 && (
        <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Zatím žádné záznamy.</p>
      )}
      <div className="glass-card">
        {sortedItems.map((item) => (
          <div
            key={item.id}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}
          >
            <span style={{ fontSize: '0.8rem', color: '#6b7280', flex: 1 }}>{item.date}</span>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af', flex: 2 }}>{item.note || '—'}</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, flex: 1, textAlign: 'right', color: item.amount < 0 ? 'var(--neg)' : 'var(--ok)' }}>
              {item.amount > 0 ? '+' : ''}{item.amount} Kč
            </span>
            <button className="btn-delete" onPointerDown={(e) => e.stopPropagation()} onClick={() => handleDelete(item.id)}>🗑</button>
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default ContributionHistoryModal;