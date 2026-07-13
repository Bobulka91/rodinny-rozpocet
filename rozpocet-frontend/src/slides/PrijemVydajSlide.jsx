/**
 * Slide 2 - Příjem/Výdaj: seznam transakcí, formulář na přidání/editaci,
 * mazání s potvrzením.
 */
import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import TransactionItem from '../components/TransactionItem'; // jeden řádek transakce
import Modal from '../components/Modal'; // obal na formulář
import TransactionForm from '../components/TransactionForm'; // formulář Income/Expense
import ConfirmDeleteModal from '../components/ConfirmDeleteModal'; // potvrzení mazání
import { createExpense, updateExpense, deleteExpense } from '../api/expenseApi';
import { createIncome, updateIncome, deleteIncome } from '../api/incomeApi';

function PrijemVydajSlide() {
  const { expenses, incomes, refetchAll, isLoading, error } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false); // je otevřený formulář na přidání/editaci?
  const [editingItem, setEditingItem] = useState(null); // null = přidáváme nové, jinak upravujeme tuhle položku
  const [itemToDelete, setItemToDelete] = useState(null); // null = nic se nemaže

  if (isLoading) return <p style={{ color: 'white' }}>Načítám...</p>;
  if (error) return <p style={{ color: 'white' }}>Chyba: {error}</p>;

  // Otevře formulář v "add" režimu - vynuluje editingItem, formulář bude prázdný
  function openAddModal() {
    setEditingItem(null);
    setIsModalOpen(true);
  }

  // Otevře formulář v "edit" režimu - uloží celou položku + typ (expense/income),
  // aby TransactionForm věděl, jaké pole předvyplnit a co po odeslání volat
  function openEditModal(item, type) {
    setEditingItem({ ...item, type });
    setIsModalOpen(true);
  }

  /**
   * Rozhoduje, jestli zavolat create nebo update API, podle toho,
   * zda editingItem existuje (editace) nebo je null (nová transakce).
   */
  async function handleSubmitTransaction(data) {
    if (editingItem) {
      // Editace existující položky - podle typu voláme update na správný modul
      if (editingItem.type === 'expense') {
        await updateExpense(editingItem.id, { amount: data.amount, date: data.date, category: data.category });
      } else {
        await updateIncome(editingItem.id, { amount: data.amount, date: data.date, type: 'HLAVNI_PRIJEM', source: data.category });
      }
    } else {
      // Nová položka - podle typu vybraného ve formuláři voláme create na správný modul
      if (data.type === 'expense') {
        await createExpense({ amount: data.amount, date: data.date, category: data.category });
      } else {
        await createIncome({ amount: data.amount, date: data.date, type: 'HLAVNI_PRIJEM', source: data.category });
      }
    }
    setIsModalOpen(false); // zavřít formulář
    setEditingItem(null); // vyčistit editační stav
    await refetchAll(); // znovu natáhnout data ze všech hooků, appka zůstane na stejné sekci
  }

  // Podle typu smazané položky volá deleteExpense, nebo deleteIncome
  async function handleConfirmDelete() {
    if (itemToDelete.type === 'expense') {
      await deleteExpense(itemToDelete.id);
    } else {
      await deleteIncome(itemToDelete.id);
    }
    setItemToDelete(null); // zavřít potvrzovací dialog
    await refetchAll();
  }

  return (
    <div className="slide">
      <div className="eyebrow">Sekce</div>
      <h2 className="section-title">Příjem / Výdaj</h2>

      {/* stopPropagation zabrání, aby klik na tlačítko spustil cokoliv jiného na pozadí */}
      <button className="btn-add" onPointerDown={(e) => e.stopPropagation()} onClick={openAddModal}>
        + Přidat
      </button>

      <div className="section-label">Výdaje</div>
      <div className="glass-card">
        {expenses.map((expense) => ( // .map() vytvoří jednu TransactionItem na každý výdaj
          <TransactionItem
            key={expense.id} // unikátní klíč - React ho potřebuje pro seznamy
            icon="💸"
            name={expense.category}
            date={expense.date}
            amount={expense.amount}
            type="expense"
            onEdit={() => openEditModal(expense, 'expense')}
            onDelete={() => setItemToDelete({ id: expense.id, type: 'expense', name: expense.category })}
          />
        ))}
      </div>

      <div className="section-label">Příjem</div>
      <div className="glass-card">
        {incomes.map((income) => (
          <TransactionItem
            key={income.id}
            icon="💼"
            name={income.source || 'Hlavní příjem'} // source je jen u vedlejších příjmů (viz IncomeDTO)
            date={income.date}
            amount={income.amount}
            type="income"
            onEdit={() => openEditModal(income, 'income')}
            onDelete={() => setItemToDelete({ id: income.id, type: 'income', name: income.source || 'Hlavní příjem' })}
          />
        ))}
      </div>

      {/* title se mění podle toho, jestli přidáváme, nebo upravujeme */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Upravit transakci' : 'Nová transakce'}>
        <TransactionForm onSubmit={handleSubmitTransaction} initialValues={editingItem} />
      </Modal>

      <ConfirmDeleteModal
        isOpen={itemToDelete !== null} // otevřený, kdykoliv je itemToDelete nastavené
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.name} // ?. - bezpečný přístup, kdyby itemToDelete bylo null
      />
    </div>
  );
}

export default PrijemVydajSlide;