/**
 * Slide 2 - Příjem. Jedno tlačítko na přidání příjmu - formulář obsahuje
 * i "+" u dropdownu zdroje pro vytvoření nové šablony za pochodu.
 * Pořadí sekcí: tlačítko -> zdroje příjmu (stromově) -> bar "kdo kolik
 * přispívá" -> jednotlivé příjmy.
 */
import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import TransactionItem from '../components/TransactionItem';
import Modal from '../components/Modal';
import IncomeForm from '../components/IncomeForm';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { createIncome, updateIncome, deleteIncome } from '../api/incomeApi';
import { createIncomeSource, deleteIncomeSource } from '../api/incomeSourceApi';

/**
 * Seskupí zdroje příjmu podle osoby - pro stromové zobrazení
 * (Bobulka -> Výplata, Fuška / Manželka -> Výplata, Dýško...).
 */
function groupSourcesByPerson(incomeSources) {
  const map = {};
  incomeSources.forEach((source) => {
    if (!map[source.person]) map[source.person] = [];
    map[source.person].push(source);
  });
  return map;
}

function PrijemSlide() {
  const { incomes, incomeSources, incomeByPerson, refetchAll, isLoading, error } = useContext(AppContext);

  const [isModalOpen, setIsModalOpen] = useState(false); // formulář na přidání/editaci příjmu
  const [editingIncome, setEditingIncome] = useState(null); // null = nový příjem, jinak editace
  const [itemToDelete, setItemToDelete] = useState(null); // mazání konkrétního příjmu
  const [sourceToDelete, setSourceToDelete] = useState(null); // mazání konkrétního zdroje

  if (isLoading) return <p style={{ color: 'white' }}>Načítám...</p>;
  if (error) return <p style={{ color: 'white' }}>Chyba: {error}</p>;

  // Součet celkových příjmů přes všechny osoby - potřebný pro výpočet % v baru
  const total = Object.values(incomeByPerson).reduce((sum, v) => sum + v, 0);
  const personBreakdown = Object.entries(incomeByPerson).map(([person, amount]) => ({
    person,
    amount,
    percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
  }));

  // Zdroje seskupené podle osoby pro stromové zobrazení
  const sourcesByPerson = groupSourcesByPerson(incomeSources);

  function openAddModal() {
    setEditingIncome(null);
    setIsModalOpen(true);
  }

  function openEditModal(income) {
    setEditingIncome(income);
    setIsModalOpen(true);
  }

  /**
   * Rozhoduje mezi create/update podle toho, jestli editingIncome existuje.
   * sourceId se posílá zvlášť jako query parametr (viz IncomeController na backendu).
   */
  async function handleSubmitIncome(data) {
  if (editingIncome) {
    // Teď posíláme i sourceId, appka umožní změnit zdroj při editaci
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

 /**
 * Smaže trvalou šablonu zdroje. Backend odmítne smazání, pokud existují
 * navázané příjmy (foreign key ochrana) - appka to zachytí a ukáže
 * uživateli srozumitelnou zprávu, místo technického pádu.
 */
async function handleConfirmDeleteSource() {
  try {
    await deleteIncomeSource(sourceToDelete.id);
    setSourceToDelete(null);
    await refetchAll();
  } catch (err) {
    // Backend vrátil chybu (pravděpodobně kvůli navázaným příjmům)
    alert('Tenhle zdroj nejde smazat - má navázané příjmy. Nejdřív smaž jednotlivé příjmy, co k němu patří.');
    setSourceToDelete(null);
  }
}

  return (
    <div className="slide">
      <div className="eyebrow">Sekce</div>
      <h2 className="section-title">Příjem</h2>

      {/* Jediné tlačítko - vytváření nových zdrojů se řeší uvnitř formuláře */}
      <button className="btn-add" onPointerDown={(e) => e.stopPropagation()} onClick={openAddModal}>
        + Přidat příjem
      </button>

      {/* Stromové zobrazení zdrojů - osoba jako nadpis, pod ní odsazené zdroje, s mazáním */}
      <div className="section-label">Zdroje příjmu</div>
      <div className="glass-card">
        {Object.entries(sourcesByPerson).map(([person, sources]) => (
          <div key={person} style={{ marginBottom: '12px' }}>
            <strong style={{ fontSize: '0.9rem' }}>{person}</strong>
            {sources.map((source) => (
              <div key={source.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0 4px 16px' }}>
                <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{source.label}</span>
                <button className="btn-delete" onPointerDown={(e) => e.stopPropagation()} onClick={() => setSourceToDelete({ id: source.id, name: `${source.person} - ${source.label}` })}>
                  🗑
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Bar "kdo kolik přispívá" - jeden pruh na osobu, data z backend agregace */}
      <div className="section-label">Kdo kolik přispívá</div>
      <div className="glass-card">
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

      {/* Seznam jednotlivých konkrétních příjmů (Income záznamů) */}
      <div className="section-label">Jednotlivé příjmy</div>
      <div className="glass-card">
        {incomes.map((income) => (
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

      {/* Modal na přidání/editaci příjmu - obsahuje i tvorbu nového zdroje uvnitř */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingIncome ? 'Upravit příjem' : 'Nový příjem'}>
        <IncomeForm
          onSubmit={handleSubmitIncome}
          incomeSources={incomeSources}
          initialValues={editingIncome}
          onCreateSource={async (data) => {
            const newSource = await createIncomeSource(data);
            await refetchAll(); // aktualizuje seznam zdrojů v celé appce (Context)
            return newSource; // appka vrátí appce vytvořený zdroj (s ID) pro automatický výběr
          }}
        />
      </Modal>

      {/* Potvrzovací dialog pro mazání konkrétního příjmu */}
      <ConfirmDeleteModal
        isOpen={itemToDelete !== null}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.name}
      />

      {/* Potvrzovací dialog pro mazání zdroje (šablony) */}
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