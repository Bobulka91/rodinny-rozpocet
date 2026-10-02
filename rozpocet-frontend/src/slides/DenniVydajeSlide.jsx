/**
 * Slide 4 - Každodenní výdaje.
 *
 * Appka rozlišuje dvě věci:
 * 1) KATEGORIE (ExpenseCategory, typ PROMENLIVA) - permanentní šablony
 *    ("Kafe", "Jídlo"), existují napříč všemi měsíci, NEMAJÍ pevnou částku.
 * 2) KONKRÉTNÍ ÚTRATY (Expense) - jednotlivé transakce vázané na datum,
 *    appka je zobrazuje a sčítá VŽDY jen za vybraný měsíc/rok - žádné
 *    automatické generování, appka počítá od nuly každý měsíc.
 */
import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import TransactionItem from '../components/TransactionItem';
import Modal from '../components/Modal';
import ExpenseEntryForm from '../components/ExpenseEntryForm';
import ExpenseCategoryLabelForm from '../components/ExpenseCategoryLabelForm';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { createExpense, updateExpense, deleteExpense } from '../api/expenseApi';
import { createExpenseCategory, updateExpenseCategory, deleteExpenseCategory } from '../api/expenseCategoryApi';

const SKUPINA = 'Každodenní výdaje';

/**
 * Sečte výdaje patřící k dané kategorii, jen pro vybraný měsíc/rok.
 */
function sumByCategoryForMonth(expenses, categoryId, month, year) {
  return expenses
    .filter((e) => e.expenseCategory?.id === categoryId)
    .filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    })
    .reduce((sum, e) => sum + e.amount, 0);
}

function DenniVydajeSlide() {
  const { expenses, expenseCategories, selectedMonth, selectedYear, refetchAll, isLoading, error } = useContext(AppContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  if (isLoading) return <p style={{ color: 'white' }}>Načítám...</p>;
  if (error) return <p style={{ color: 'white' }}>Chyba: {error}</p>;

  // Jen kategorie patřící do skupiny "Každodenní výdaje" - permanentní, zobrazené vždy
  const categories = expenseCategories.filter((c) => c.categoryGroup === SKUPINA);

  // Výdaje téhle skupiny, jen za vybraný měsíc - základ pro seznam i celkový součet
  const monthlyExpenses = expenses.filter((e) => {
    if (e.expenseCategory?.categoryGroup !== SKUPINA) return false;
    const d = new Date(e.date);
    return d.getFullYear() === selectedYear && d.getMonth() + 1 === selectedMonth;
  });
  const monthlyTotal = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

  function openAddModal() {
    setEditingExpense(null);
    setIsModalOpen(true);
  }

  function openEditModal(expense) {
    setEditingExpense(expense);
    setIsModalOpen(true);
  }

  /** Rozhoduje mezi create/update podle toho, jestli editingExpense existuje. */
  async function handleSubmitExpense(data) {
    if (editingExpense) {
      await updateExpense(editingExpense.id, { amount: data.amount, date: data.date });
    } else {
      await createExpense({ amount: data.amount, date: data.date }, data.categoryId);
    }
    setIsModalOpen(false);
    setEditingExpense(null);
    await refetchAll();
  }

  async function handleConfirmDelete() {
    await deleteExpense(itemToDelete.id);
    setItemToDelete(null);
    await refetchAll();
  }

  function openEditCategory(category) {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  }

  /** Uloží úpravu existující kategorie, nebo vytvoří novou. */
  async function handleSubmitCategory(data) {
    if (editingCategory) {
      await updateExpenseCategory(editingCategory.id, { ...data, categoryGroup: SKUPINA, type: 'PROMENLIVA' });
    } else {
      await createExpenseCategory({ ...data, categoryGroup: SKUPINA, type: 'PROMENLIVA', amount: 0 });
    }
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
    await refetchAll();
  }

  /** Smaže kategorii - backend to odmítne, pokud má navázané výdaje. */
  async function handleConfirmDeleteCategory() {
    try {
      await deleteExpenseCategory(categoryToDelete.id);
      setCategoryToDelete(null);
      await refetchAll();
    } catch (err) {
      alert('Tuhle kategorii nejde smazat - má navázané výdaje. Nejdřív smaž jednotlivé útraty, co k ní patří.');
      setCategoryToDelete(null);
    }
  }

  return (
    <div className="slide">
      <div className="eyebrow">Sekce</div>
      <h2 className="section-title">Každodenní výdaje</h2>

      <button className="btn-add" onPointerDown={(e) => e.stopPropagation()} onClick={openAddModal}>
        + Přidat výdaj
      </button>

      {/* Kategorie (šablony) - permanentní, se součtem za vybraný měsíc */}
      <div className="section-label">Kategorie ({selectedMonth}/{selectedYear})</div>
      <div className="glass-card">
        {categories.length === 0 && (
          <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Zatím nemáš žádné kategorie - přidej je přes "+ Přidat výdaj".</p>
        )}
        {categories.map((category) => {
          const monthlySum = sumByCategoryForMonth(expenses, category.id, selectedMonth, selectedYear);
          return (
            <div
              key={category.id}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}
            >
              <span style={{ fontSize: '0.85rem' }}>{category.label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{monthlySum} Kč</span>
                <button className="btn-edit" onPointerDown={(e) => e.stopPropagation()} onClick={() => openEditCategory(category)}>✏️</button>
                <button
                  className="btn-delete"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => setCategoryToDelete({ id: category.id, name: category.label })}
                >
                  🗑
                </button>
              </div>
            </div>
          );
        })}
        {categories.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', fontWeight: 700, fontSize: '0.9rem' }}>
            <span>Celkem tento měsíc</span>
            <span>{monthlyTotal} Kč</span>
          </div>
        )}
      </div>

      {/* Jednotlivé konkrétní útraty - jen za vybraný měsíc */}
      <div className="section-label">Jednotlivé útraty ({selectedMonth}/{selectedYear})</div>
      <div className="glass-card">
        {monthlyExpenses.length === 0 && (
          <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Pro tenhle měsíc zatím nejsou žádné záznamy.</p>
        )}
        {monthlyExpenses.map((expense) => (
          <TransactionItem
            key={expense.id}
            icon="🛒"
            name={expense.expenseCategory?.label || 'Bez kategorie'}
            date={expense.date}
            amount={expense.amount}
            type="expense"
            onEdit={() => openEditModal(expense)}
            onDelete={() => setItemToDelete({ id: expense.id, name: expense.expenseCategory?.label || 'výdaj' })}
          />
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingExpense ? 'Upravit výdaj' : 'Nový výdaj'}>
        <ExpenseEntryForm
          onSubmit={handleSubmitExpense}
          categories={categories}
          initialValues={editingExpense}
          onCreateCategory={async (data) => {
            const newCategory = await createExpenseCategory({ ...data, categoryGroup: SKUPINA, type: 'PROMENLIVA', amount: 0 });
            await refetchAll();
            return newCategory;
          }}
        />
      </Modal>

      <Modal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} title="Upravit kategorii">
        <ExpenseCategoryLabelForm onSubmit={handleSubmitCategory} categoryGroup={SKUPINA} initialValues={editingCategory} />
      </Modal>

      <ConfirmDeleteModal
        isOpen={itemToDelete !== null}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.name}
      />

      <ConfirmDeleteModal
        isOpen={categoryToDelete !== null}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleConfirmDeleteCategory}
        itemName={categoryToDelete?.name}
      />
    </div>
  );
}

export default DenniVydajeSlide;