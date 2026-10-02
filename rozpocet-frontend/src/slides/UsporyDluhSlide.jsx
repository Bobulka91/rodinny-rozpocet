/**
 * Slide 5 - Spoření/Dluh: cíle spoření a dluhy, každý s vlastním
 * formulářem, editací i mazáním. Souhrnný RingChart dole ukazuje
 * celkové splacení napříč všemi dluhy.
 *
 * NOVĚ: currentAmount/paidAmount se už nepřepisují ručně - appka je
 * skládá z jednotlivých vkladů/splátek (SavingContribution/DebtPayment),
 * zobrazených přes 📜 tlačítko u každého cíle/dluhu. Backend si při
 * přidání/smazání záznamu currentAmount/paidAmount sám přepočítá,
 * appka tady jen po každé akci zavolá refetchAll().
 */
import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import ProgressBar from '../components/ProgressBar';
import RingChart from '../components/RingChart';
import Modal from '../components/Modal';
import SavingGoalForm from '../components/SavingGoalForm';
import DebtForm from '../components/DebtForm';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import ContributionHistoryModal from '../components/ContributionHistoryModal';
import { createSavingGoal, updateSavingGoal, deleteSavingGoal } from '../api/savingGoalApi';
import { createDebt, updateDebt, deleteDebt } from '../api/debtApi';
import { getContributions, createContribution, deleteContribution } from '../api/savingContributionApi';
import { getPayments, createPayment, deletePayment } from '../api/debtPaymentApi';

function SporeniDluhSlide() {
  const { savingGoals, debts, refetchAll, isLoading, error } = useContext(AppContext);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false); // formulář na cíl spoření
  const [isDebtModalOpen, setIsDebtModalOpen] = useState(false); // formulář na dluh
  const [editingGoal, setEditingGoal] = useState(null); // null = nový cíl, jinak editace
  const [editingDebt, setEditingDebt] = useState(null); // null = nový dluh, jinak editace
  // Jeden společný stav pro mazání OBOU typů (rozlišené přes type: 'goal'/'debt')
  const [itemToDelete, setItemToDelete] = useState(null);

  // --- Stav pro historii vkladů (cíle spoření) ---
  const [historyGoal, setHistoryGoal] = useState(null); // otevřený cíl, jehož historii appka zobrazuje (null = zavřeno)
  const [goalContributions, setGoalContributions] = useState([]);

  // --- Stav pro historii splátek (dluhy) ---
  const [historyDebt, setHistoryDebt] = useState(null);
  const [debtPayments, setDebtPayments] = useState([]);

  if (isLoading) return <p style={{ color: 'white' }}>Načítám...</p>;
  if (error) return <p style={{ color: 'white' }}>Chyba: {error}</p>;

  // Součty přes všechny dluhy - pro souhrnný RingChart dole
  const totalDebt = debts.reduce((sum, d) => sum + d.totalAmount, 0); // celková výše všech dluhů
  const totalPaid = debts.reduce((sum, d) => sum + d.paidAmount, 0); // kolik už je celkem splaceno
  const debtPercentage = totalDebt > 0 ? Math.round((totalPaid / totalDebt) * 100) : 0; // ošetření dělení nulou

  // Součty přes všechny cíle spoření - pro druhý souhrnný RingChart (stejná logika jako u dluhu)
  const totalSavingsTarget = savingGoals.reduce((sum, g) => sum + g.targetAmount, 0); // součet cílových částek
  const totalSavingsCurrent = savingGoals.reduce((sum, g) => sum + g.currentAmount, 0); // kolik je už naspořeno
  const savingsPercentage = totalSavingsTarget > 0 ? Math.round((totalSavingsCurrent / totalSavingsTarget) * 100) : 0;

  // Čtveřice krátkých funkcí na otevření formulářů - add vynuluje editační stav, edit ho nastaví
  function openAddGoal() { setEditingGoal(null); setIsGoalModalOpen(true); }
  function openEditGoal(goal) { setEditingGoal(goal); setIsGoalModalOpen(true); }
  function openAddDebt() { setEditingDebt(null); setIsDebtModalOpen(true); }
  function openEditDebt(debt) { setEditingDebt(debt); setIsDebtModalOpen(true); }

  // Rozhoduje mezi create/update podle toho, jestli editingGoal existuje
  async function handleSubmitGoal(data) {
    if (editingGoal) {
      await updateSavingGoal(editingGoal.id, data);
    } else {
      await createSavingGoal(data);
    }
    setIsGoalModalOpen(false);
    setEditingGoal(null);
    await refetchAll(); // obnoví data, appka zůstane na tomhle slidu
  }

  // Rozhoduje mezi create/update podle toho, jestli editingDebt existuje
  async function handleSubmitDebt(data) {
    if (editingDebt) {
      await updateDebt(editingDebt.id, data);
    } else {
      await createDebt(data);
    }
    setIsDebtModalOpen(false);
    setEditingDebt(null);
    await refetchAll();
  }

  // Podle type v itemToDelete rozhodne, jestli mazat SavingGoal, nebo Debt
  async function handleConfirmDelete() {
    if (itemToDelete.type === 'goal') {
      await deleteSavingGoal(itemToDelete.id);
    } else {
      await deleteDebt(itemToDelete.id);
    }
    setItemToDelete(null);
    await refetchAll();
  }

  // --- Handlery pro historii vkladů (cíle spoření) ---

  /** Otevře historii vkladů pro konkrétní cíl a rovnou ji natáhne z backendu. */
  async function openGoalHistory(goal) {
    setHistoryGoal(goal);
    const data = await getContributions(goal.id);
    setGoalContributions(data);
  }

  /** Přidá nový vklad, obnoví historii v modalu i currentAmount na appce jako celku. */
  async function handleAddContribution(data) {
    await createContribution(historyGoal.id, data);
    const refreshed = await getContributions(historyGoal.id);
    setGoalContributions(refreshed);
    await refetchAll(); // natáhne novou currentAmount, co spočítal backend
  }

  async function handleDeleteContribution(id) {
    await deleteContribution(id);
    const refreshed = await getContributions(historyGoal.id);
    setGoalContributions(refreshed);
    await refetchAll();
  }

  // --- Handlery pro historii splátek (dluhy) ---

  async function openDebtHistory(debt) {
    setHistoryDebt(debt);
    const data = await getPayments(debt.id);
    setDebtPayments(data);
  }

  async function handleAddPayment(data) {
    await createPayment(historyDebt.id, data);
    const refreshed = await getPayments(historyDebt.id);
    setDebtPayments(refreshed);
    await refetchAll();
  }

  async function handleDeletePayment(id) {
    await deletePayment(id);
    const refreshed = await getPayments(historyDebt.id);
    setDebtPayments(refreshed);
    await refetchAll();
  }

  return (
    <div className="slide">
      <div className="eyebrow">Sekce</div>
      <h2 className="section-title">Spoření / Dluh</h2>

      <div className="section-label">Cíle spoření</div>
      <button className="btn-add" onPointerDown={(e) => e.stopPropagation()} onClick={openAddGoal}>
        + Přidat cíl
      </button>
      <div className="glass-card">
        {savingGoals.map((goal) => ( // jeden ProgressBar na každý cíl spoření
          <ProgressBar
            key={goal.id}
            label={goal.category}
            current={goal.currentAmount} // kolik už je naspořeno
            target={goal.targetAmount} // cílová částka
            onEdit={() => openEditGoal(goal)}
            onDelete={() => setItemToDelete({ id: goal.id, type: 'goal', name: goal.category })}
            onHistory={() => openGoalHistory(goal)}
          />
        ))}
      </div>

      <div className="section-label">Dluh</div>
      <button className="btn-add" onPointerDown={(e) => e.stopPropagation()} onClick={openAddDebt}>
        + Přidat dluh
      </button>
      <div className="glass-card">
        {debts.map((debt) => ( // jeden ProgressBar na každý dluh
          <ProgressBar
            key={debt.id}
            label={debt.category}
            current={debt.paidAmount} // kolik už je splaceno
            target={debt.totalAmount} // celková výše dluhu
            onEdit={() => openEditDebt(debt)}
            onDelete={() => setItemToDelete({ id: debt.id, type: 'debt', name: debt.category })}
            onHistory={() => openDebtHistory(debt)}
          />
        ))}
      </div>

      <div className="section-label">Celkový přehled</div>
      <div className="glass-card">
        {/* Dva souhrnné ringy vedle sebe - spoření a dluh počítané zvlášť,
            napříč VŠEMI cíli/dluhy, ne jednotlivě. Díky tomu zůstane přehled
            kompaktní bez ohledu na to, kolik cílů/dluhů appka eviduje. */}
        <div className="rings-row">
          <RingChart
            percentage={savingsPercentage}
            label="Naspořeno"
            sublabel={`${totalSavingsCurrent} / ${totalSavingsTarget} Kč`}
          />
          <RingChart
            percentage={debtPercentage}
            label="Splaceno"
            sublabel={`${totalPaid} / ${totalDebt} Kč`}
          />
        </div>
      </div>

      <Modal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} title={editingGoal ? 'Upravit cíl' : 'Nový cíl spoření'}>
        <SavingGoalForm onSubmit={handleSubmitGoal} initialValues={editingGoal} />
      </Modal>

      <Modal isOpen={isDebtModalOpen} onClose={() => setIsDebtModalOpen(false)} title={editingDebt ? 'Upravit dluh' : 'Nový dluh'}>
        <DebtForm onSubmit={handleSubmitDebt} initialValues={editingDebt} />
      </Modal>

      <ConfirmDeleteModal
        isOpen={itemToDelete !== null}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.name}
      />

      <ContributionHistoryModal
        isOpen={historyGoal !== null}
        onClose={() => setHistoryGoal(null)}
        title={historyGoal ? `Historie vkladů - ${historyGoal.category}` : ''}
        items={goalContributions}
        onAdd={handleAddContribution}
        onDelete={handleDeleteContribution}
        allowNegativeAmount={true}
      />

      <ContributionHistoryModal
        isOpen={historyDebt !== null}
        onClose={() => setHistoryDebt(null)}
        title={historyDebt ? `Historie splátek - ${historyDebt.category}` : ''}
        items={debtPayments}
        onAdd={handleAddPayment}
        onDelete={handleDeletePayment}
        allowNegativeAmount={false}
      />
    </div>
  );
}

export default SporeniDluhSlide;