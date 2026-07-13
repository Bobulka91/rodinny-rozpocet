/**
 * Slide 4 - Analýza/Historie: sloupcový graf příjmy vs. výdaje po měsících
 * a tabulka Plán vs. skutečnost (s editací/mazáním jednotlivých plánů).
 */
import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import PlanComparisonTable from '../components/PlanComparisonTable';
import MonthlyBarChart from '../components/MonthlyBarChart'; // Recharts sloupcový graf
import Modal from '../components/Modal';
import PlanForm from '../components/PlanForm';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { createPlan, updatePlan, deletePlan } from '../api/planApi';

/**
 * Seskupí příjmy a výdaje podle měsíce (RRRR-MM z data transakce)
 * a připraví je ve tvaru, co čeká MonthlyBarChart (Recharts).
 */
export function buildMonthlyData(incomes, expenses) {
  const monthMap = {}; // "slovník" - klíč je měsíc "RRRR-MM", hodnota jsou součty

  incomes.forEach((income) => {
    const month = income.date.slice(0, 7); // "2026-07-15" -> "2026-07"
    if (!monthMap[month]) monthMap[month] = { month, income: 0, expense: 0 }; // založ záznam, pokud ještě neexistuje
    monthMap[month].income += income.amount;
  });

  expenses.forEach((expense) => {
    const month = expense.date.slice(0, 7);
    if (!monthMap[month]) monthMap[month] = { month, income: 0, expense: 0 };
    monthMap[month].expense += expense.amount;
  });

  // Object.values() vytáhne jen hodnoty ze "slovníku" jako pole (bez klíčů)
  return Object.values(monthMap).sort((a, b) => a.month.localeCompare(b.month)); // chronologické řazení
}

function AnalyzaHistorieSlide() {
  // plans (celý seznam) potřebujeme navíc kvůli editaci (viz openEditPlan níže)
  const { incomes, expenses, plans, planComparisonRows, refetchAll, isLoading, error } = useContext(AppContext);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null); // null = nový plán, jinak editace
  const [planToDelete, setPlanToDelete] = useState(null);

  if (isLoading) return <p style={{ color: 'white' }}>Načítám...</p>;
  if (error) return <p style={{ color: 'white' }}>Chyba: {error}</p>;

  const monthlyData = buildMonthlyData(incomes, expenses); // data pro graf

  function openAddPlan() { setEditingPlan(null); setIsPlanModalOpen(true); }

  // Řádek z planComparisonRows nemá month/year (compare() endpoint je nevrací),
  // takže pro editaci dohledáme kompletní Plan objekt v plans podle id
  function openEditPlan(row) {
    const fullPlan = plans.find((p) => p.id === row.id); // .find() vrátí první shodu, nebo undefined
    setEditingPlan(fullPlan);
    setIsPlanModalOpen(true);
  }

  // Rozhoduje mezi create/update podle toho, jestli editingPlan existuje
  async function handleSubmitPlan(data) {
    if (editingPlan) {
      await updatePlan(editingPlan.id, data);
    } else {
      await createPlan(data);
    }
    setIsPlanModalOpen(false);
    setEditingPlan(null);
    await refetchAll(); // obnoví data, appka zůstane na tomhle slidu
  }

  async function handleConfirmDelete() {
    await deletePlan(planToDelete.id);
    setPlanToDelete(null);
    await refetchAll();
  }

  return (
    <div className="slide">
      <div className="eyebrow">Sekce</div>
      <h2 className="section-title">Analýza / Historie</h2>

      <div className="section-label">Příjmy vs. výdaje po měsících</div>
      <div className="glass-card">
        <MonthlyBarChart data={monthlyData} />
      </div>

      <div className="section-label">Plán vs. skutečnost</div>
      <button className="btn-add" onPointerDown={(e) => e.stopPropagation()} onClick={openAddPlan}>
        + Přidat plán
      </button>
      <div className="glass-card">
        <PlanComparisonTable
          rows={planComparisonRows}
          onEdit={openEditPlan}
          onDelete={(row) => setPlanToDelete({ id: row.id, name: row.category })}
        />
      </div>

      <Modal isOpen={isPlanModalOpen} onClose={() => setIsPlanModalOpen(false)} title={editingPlan ? 'Upravit plán' : 'Nový plán'}>
        <PlanForm onSubmit={handleSubmitPlan} initialValues={editingPlan} />
      </Modal>

      <ConfirmDeleteModal
        isOpen={planToDelete !== null}
        onClose={() => setPlanToDelete(null)}
        onConfirm={handleConfirmDelete}
        itemName={planToDelete?.name}
      />
    </div>
  );
}

export default AnalyzaHistorieSlide;