/**
 * Slide 2 - Příjem/Výdaj: seznam transakcí, formulář na přidání/editaci,
 * mazání s potvrzením. Po restrukturalizaci backendu appka pracuje
 * s ExpenseCategory/IncomeSource jako vnořenými objekty, ne prostým textem.
 */
import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import TransactionItem from '../components/TransactionItem';
import Modal from '../components/Modal';
import TransactionForm from '../components/TransactionForm';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { createExpense, updateExpense, deleteExpense } from '../api/expenseApi';
import { createIncome, updateIncome, deleteIncome } from '../api/incomeApi';

function PrijemVydajSlide() {
  const { expenses, incomes, expenseCategories, incomeSources, refetchAll, isLoading, error } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  if (isLoading) return <p style={{ color: 'white' }}>Načítám...</p>;
  if (error) return <p style={{ color: 'white' }}>Chyba: {error}</p>;

  function openAddModal() {
    setEditingItem(null);
    setIsModalOpen(true);
  }

  function openEditModal(item, type) {
    setEditingItem({ ...item, type });
    setIsModalOpen(true);
  }

  /**
   * Rozhoduje mezi create/update podle toho, jestli editingItem existuje.
   * Kategorii/zdroj posíláme jako samostatné ID (categoryId/sourceId) v query
   * parametru, ne jako součást těla - takhle to backend očekává.
   */
  async function handleSubmitTransaction(data) {
    if (editingItem) {
      // Editace - podle backendu update NEMĚNÍ kategorii/zdroj, jen amount/date
      if (editingItem.type === 'expense') {
        await updateExpense(editingItem.id, { amount: data.amount, date: data.date });
      } else {
        await updateIncome(editingItem.id, { amount: data.amount, date: data.date, type: data.incomeType });
      }
    } else {
      // Nová položka - ID kategorie/zdroje posíláme zvlášť
      if (data.type === 'expense') {
        await createExpense({ amount: data.amount, date: data.date }, data.categoryId);
      } else {
        await createIncome({ amount: data.amount, date: data.date, type: data.incomeType }, data.sourceId);
      }
    }
    setIsModalOpen(false);
    setEditingItem(null);
    await refetchAll();
  }

  async function handleConfirmDelete() {
    if (itemToDelete.type === 'expense') {
      await deleteExpense(itemToDelete.id);
    } else {
      await deleteIncome(itemToDelete.id);
    }
    setItemToDelete(null);
    await refetchAll();
  }

  return (
    <div className="slide">
      <div className="eyebrow">Sekce</div>
      <h2 className="section-title">Příjem / Výdaj</h2>

      <button className="btn-add" onPointerDown={(e) => e.stopPropagation()} onClick={openAddModal}>
        + Přidat
      </button>

      <div className="section-label">Výdaje</div>
      <div className="glass-card">
        {expenses.map((expense) => (
          <TransactionItem
            key={expense.id}
            icon="💸"
            // expenseCategory může být null (staré záznamy před restrukturalizací)
            name={expense.expenseCategory?.label || 'Bez kategorie'}
            date={expense.date}
            amount={expense.amount}
            type="expense"
            onEdit={() => openEditModal(expense, 'expense')}
            onDelete={() => setItemToDelete({ id: expense.id, type: 'expense', name: expense.expenseCategory?.label || 'výdaj' })}
          />
        ))}
      </div>

      <div className="section-label">Příjem</div>
      <div className="glass-card">
        {incomes.map((income) => (
          <TransactionItem
            key={income.id}
            icon="💼"
            // Spojíme person + label pro čitelný název, např. "Já - Výplata"
            name={income.incomeSource ? `${income.incomeSource.person} - ${income.incomeSource.label}` : 'Bez zdroje'}
            date={income.date}
            amount={income.amount}
            type="income"
            onEdit={() => openEditModal(income, 'income')}
            onDelete={() => setItemToDelete({ id: income.id, type: 'income', name: income.incomeSource?.label || 'příjem' })}
          />
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Upravit transakci' : 'Nová transakce'}>
        <TransactionForm
          onSubmit={handleSubmitTransaction}
          initialValues={editingItem}
          expenseCategories={expenseCategories}
          incomeSources={incomeSources}
        />
      </Modal>

      <ConfirmDeleteModal
        isOpen={itemToDelete !== null}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.name}
      />
    </div>
  );
}

export default PrijemVydajSlide;