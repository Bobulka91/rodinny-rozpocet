/**
 * Slide 2 - Příjem.
 *
 * Appka rozlišuje dvě věci:
 * 1) ZDROJE (IncomeSource) - permanentní šablony ("Bobulka - Výplata"),
 *    existují napříč všemi měsíci, dokud je ručně nesmažeš.
 * 2) KONKRÉTNÍ PŘÍJMY (Income) - jednotlivé transakce vázané na datum,
 *    appka je zobrazuje a sčítá VŽDY jen za vybraný měsíc/rok.
 */
import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import TransactionItem from '../components/TransactionItem';
import Modal from '../components/Modal';
import IncomeForm from '../components/IncomeForm';
import IncomeSourceForm from '../components/IncomeSourceForm';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { createIncome, updateIncome, deleteIncome } from '../api/incomeApi';
import { createIncomeSource, updateIncomeSource, deleteIncomeSource } from '../api/incomeSourceApi';

/**
 * Seskupí zdroje příjmu podle osoby - pro stromové zobrazení
 * (Bobulka -> Výplata, Fuška / Hanka -> Výplata, Dýško...).
 * .trim() ignoruje mezery navíc, ať appka nerozdělí stejnou osobu na dvě.
 */
function groupSourcesByPerson(incomeSources) {
  const map = {};
  incomeSources.forEach((source) => {
    const key = source.person.trim();
    if (!map[key]) map[key] = [];
    map[key].push(source);
  });
  return map;
}

/**
 * Sečte příjmy patřící k danému zdroji, jen pro vybraný měsíc/rok.
 */
function sumBySourceForMonth(incomes, sourceId, month, year) {
  return incomes
    .filter((i) => i.incomeSource?.id === sourceId)
    .filter((i) => {
      const d = new Date(i.date);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    })
    .reduce((sum, i) => sum + i.amount, 0);
}

/**
 * Vrátí VŠECHNY příjmy navázané na daný zdroj, bez ohledu na měsíc/rok -
 * na rozdíl od zbytku slidu, tahle sekce je záměrně napříč celou historií.
 * Seřazené od nejnovějšího, ať je nejnovější transakce nahoře.
 */
function getHistoryForSource(incomes, sourceId) {
  return incomes
    .filter((i) => i.incomeSource?.id === Number(sourceId))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function PrijemSlide() {
  const { incomes, incomeSources, selectedMonth, selectedYear, refetchAll, isLoading, error } = useContext(AppContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [sourceToDelete, setSourceToDelete] = useState(null);
  const [editingSource, setEditingSource] = useState(null);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);

  // --- Stav pro novou sekci "Historie podle zdroje" ---
  const [historySourceId, setHistorySourceId] = useState(''); // '' = žádný zdroj nevybraný
  const [selectedHistoryIds, setSelectedHistoryIds] = useState(new Set()); // ID příjmů zaškrtnutých k mazání

  if (isLoading) return <p style={{ color: 'white' }}>Načítám...</p>;
  if (error) return <p style={{ color: 'white' }}>Chyba: {error}</p>;

  // Příjmy jen za vybraný měsíc - základ pro bar i seznam jednotlivých příjmů
  const monthlyIncomes = incomes.filter((income) => {
    const d = new Date(income.date);
    return d.getFullYear() === selectedYear && d.getMonth() + 1 === selectedMonth;
  });

  // Součty podle osoby, POUZE z příjmů za vybraný měsíc
  const personTotals = {};
  monthlyIncomes.forEach((income) => {
    if (!income.incomeSource) return;
    const person = income.incomeSource.person;
    personTotals[person] = (personTotals[person] || 0) + income.amount;
  });
  const totalIncome = Object.values(personTotals).reduce((sum, v) => sum + v, 0);
  const personBreakdown = Object.entries(personTotals).map(([person, amount]) => ({
    person,
    amount,
    percentage: totalIncome > 0 ? Math.round((amount / totalIncome) * 100) : 0,
  }));

  // Zdroje seskupené podle osoby - appka je zobrazuje VŽDY všechny (jsou permanentní)
  const sourcesByPerson = groupSourcesByPerson(incomeSources);

  // Historie příjmů pro vybraný zdroj v nové sekci (napříč všemi měsíci)
  const historyIncomes = historySourceId ? getHistoryForSource(incomes, historySourceId) : [];
  const allHistorySelected = historyIncomes.length > 0 && selectedHistoryIds.size === historyIncomes.length;

  function openAddModal() {
    setEditingIncome(null);
    setIsModalOpen(true);
  }

  function openEditModal(income) {
    setEditingIncome(income);
    setIsModalOpen(true);
  }

  /** Rozhoduje mezi create/update podle toho, jestli editingIncome existuje. */
  async function handleSubmitIncome(data) {
    if (editingIncome) {
      await updateIncome(editingIncome.id, { amount: data.amount, date: data.date }, data.sourceId);
    } else {
      await createIncome({ amount: data.amount, date: data.date }, data.sourceId);
    }
    setIsModalOpen(false);
    setEditingIncome(null);
    await refetchAll();
  }

  async function handleConfirmDelete() {
    await deleteIncome(itemToDelete.id);
    setItemToDelete(null);
    await refetchAll();
  }

  /** Smaže šablonu zdroje - backend to odmítne, pokud má navázané příjmy. */
  async function handleConfirmDeleteSource() {
    try {
      await deleteIncomeSource(sourceToDelete.id);
      setSourceToDelete(null);
      await refetchAll();
    } catch (err) {
      alert('Tenhle zdroj nejde smazat - má navázané příjmy. Nejdřív smaž jednotlivé příjmy, co k němu patří.');
      setSourceToDelete(null);
    }
  }

  function openEditSource(source) {
    setEditingSource(source);
    setIsSourceModalOpen(true);
  }

  /** Uloží úpravu existující šablony, nebo vytvoří novou. */
  async function handleSubmitSource(data) {
    if (editingSource) {
      await updateIncomeSource(editingSource.id, data);
    } else {
      await createIncomeSource(data);
    }
    setIsSourceModalOpen(false);
    setEditingSource(null);
    await refetchAll();
  }

  // --- Handlery pro novou sekci "Historie podle zdroje" ---

  /** Změna vybraného zdroje v dropdownu - zároveň vyprázdní výběr checkboxů. */
  function handleHistorySourceChange(value) {
    setHistorySourceId(value);
    setSelectedHistoryIds(new Set());
  }

  /** Zaškrtne/odškrtne jednu konkrétní transakci v historii. */
  function toggleHistorySelection(id) {
    setSelectedHistoryIds((prev) => {
      const next = new Set(prev); // appka nikdy nemutuje předchozí Set přímo (React state musí být nový objekt)
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  /** "Vybrat vše" / "Zrušit výběr" - přepíná mezi celým a prázdným výběrem. */
  function toggleSelectAllHistory() {
    if (allHistorySelected) {
      setSelectedHistoryIds(new Set());
    } else {
      setSelectedHistoryIds(new Set(historyIncomes.map((i) => i.id)));
    }
  }

  /**
   * Smaže všechny zaškrtnuté příjmy najednou.
   * Appka nemá bulk-delete endpoint na backendu, takže pošle jednotlivé
   * DELETE požadavky paralelně (Promise.all) a pak jednou obnoví data.
   * Stejný try/catch + alert() vzor appka používá u mazání šablony.
   */
  async function handleDeleteSelectedHistory() {
    if (selectedHistoryIds.size === 0) return;
    const confirmed = window.confirm(`Opravdu smazat ${selectedHistoryIds.size} vybraných záznamů? Tohle nejde vzít zpět.`);
    if (!confirmed) return;

    try {
      await Promise.all([...selectedHistoryIds].map((id) => deleteIncome(id)));
      setSelectedHistoryIds(new Set());
      await refetchAll();
    } catch (err) {
      alert('Něco se nepovedlo smazat. Zkus to prosím znovu.');
    }
  }

  return (
    <div className="slide">
      <div className="eyebrow">Sekce</div>
      <h2 className="section-title">Příjem</h2>

      <button className="btn-add" onPointerDown={(e) => e.stopPropagation()} onClick={openAddModal}>
        + Přidat příjem
      </button>

      {/* Zdroje (šablony) - permanentní, zobrazené vždy, se součtem za vybraný měsíc */}
      <div className="section-label">Zdroje příjmu ({selectedMonth}/{selectedYear})</div>
      <div className="glass-card">
        {Object.entries(sourcesByPerson).map(([person, sources]) => (
          <div key={person} style={{ marginBottom: '12px' }}>
            <strong style={{ fontSize: '0.9rem' }}>{person}</strong>
            {sources.map((source) => {
              const monthlySum = sumBySourceForMonth(incomes, source.id, selectedMonth, selectedYear);
              return (
                <div
                  key={source.id}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0 6px 16px' }}
                >
                  <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{source.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{monthlySum} Kč</span>
                    <button className="btn-edit" onPointerDown={(e) => e.stopPropagation()} onClick={() => openEditSource(source)}>✏️</button>
                    <button
                      className="btn-delete"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={() => setSourceToDelete({ id: source.id, name: `${source.person} - ${source.label}` })}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bar "kdo kolik přispívá" - jen za vybraný měsíc */}
      <div className="section-label">Kdo kolik přispívá ({selectedMonth}/{selectedYear})</div>
      <div className="glass-card">
        {personBreakdown.length === 0 && (
          <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Pro tenhle měsíc zatím nejsou žádné příjmy.</p>
        )}
        {personBreakdown.map((item) => (
          <div key={item.person} style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
              <span>{item.person}</span>
              <span>{item.percentage}% ({item.amount} Kč)</span>
            </div>
            <div className="bar-bg">
              <div className="bar-fill" style={{ width: `${item.percentage}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Jednotlivé konkrétní příjmy - jen za vybraný měsíc */}
      <div className="section-label">Jednotlivé příjmy ({selectedMonth}/{selectedYear})</div>
      <div className="glass-card">
        {monthlyIncomes.length === 0 && (
          <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Pro tenhle měsíc zatím nejsou žádné záznamy.</p>
        )}
        {monthlyIncomes.map((income) => (
          <TransactionItem
            key={income.id}
            icon="💼"
            name={income.incomeSource ? `${income.incomeSource.person} - ${income.incomeSource.label}` : 'Bez zdroje'}
            date={income.date}
            amount={income.amount}
            type="income"
            onEdit={() => openEditModal(income)}
            onDelete={() => setItemToDelete({ id: income.id, name: income.incomeSource?.label || 'příjem' })}
          />
        ))}
      </div>

      {/* NOVÁ SEKCE: Historie podle zdroje - napříč VŠEMI měsíci, s hromadným mazáním */}
      <div className="section-label">Historie podle zdroje (všechny měsíce)</div>
      <div className="glass-card">
        <select
          className="history-source-select"
          value={historySourceId}
          onChange={(e) => handleHistorySourceChange(e.target.value)}
          style={{ marginBottom: '12px' }}
        >
          <option value="">Vyber zdroj...</option>
          {incomeSources.map((source) => (
            <option key={source.id} value={source.id}>
              {source.person} - {source.label}
            </option>
          ))}
        </select>

        {historySourceId && historyIncomes.length === 0 && (
          <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Tenhle zdroj zatím nemá žádné příjmy v historii.</p>
        )}

        {historySourceId && historyIncomes.length > 0 && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
                <input type="checkbox" checked={allHistorySelected} onChange={toggleSelectAllHistory} />
                Vybrat vše ({historyIncomes.length})
              </label>
              <button
                className="btn-delete"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={handleDeleteSelectedHistory}
                disabled={selectedHistoryIds.size === 0}
              >
                🗑 Smazat vybrané ({selectedHistoryIds.size})
              </button>
            </div>

            {historyIncomes.map((income) => (
              <div
                key={income.id}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0', borderTop: '1px solid rgba(0,0,0,0.05)' }}
              >
                <input
                  type="checkbox"
                  checked={selectedHistoryIds.has(income.id)}
                  onChange={() => toggleHistorySelection(income.id)}
                />
                <span style={{ fontSize: '0.8rem', color: '#6b7280', flex: 1 }}>{income.date}</span>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af', flex: 2 }}>
                  {income.incomeSource ? `${income.incomeSource.person} - ${income.incomeSource.label}` : 'Bez zdroje'}
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, flex: 1, textAlign: 'right' }}>{income.amount} Kč</span>
              </div>
            ))}
          </>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingIncome ? 'Upravit příjem' : 'Nový příjem'}>
        <IncomeForm
          onSubmit={handleSubmitIncome}
          incomeSources={incomeSources}
          initialValues={editingIncome}
          onCreateSource={async (data) => {
            const newSource = await createIncomeSource(data);
            await refetchAll();
            return newSource;
          }}
        />
      </Modal>

      <Modal isOpen={isSourceModalOpen} onClose={() => setIsSourceModalOpen(false)} title={editingSource ? 'Upravit zdroj' : 'Nový zdroj'}>
        <IncomeSourceForm onSubmit={handleSubmitSource} initialValues={editingSource} />
      </Modal>

      <ConfirmDeleteModal
        isOpen={itemToDelete !== null}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.name}
      />

      <ConfirmDeleteModal
        isOpen={sourceToDelete !== null}
        onClose={() => setSourceToDelete(null)}
        onConfirm={handleConfirmDeleteSource}
        itemName={sourceToDelete?.name}
      />
    </div>
  );
}

export default PrijemSlide;