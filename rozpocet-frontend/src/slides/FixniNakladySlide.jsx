/**
 * Slide 3 - Fixní náklady + Předplatné.
 *
 * Appka rozlišuje DVĚ různé věci, co appka nesmí plést dohromady:
 * 1) ŠABLONA (ExpenseCategory) - "vzor", podle kterého appka generuje
 *    výdaje pro nový měsíc. Úprava šablony ovlivní jen BUDOUCÍ měsíce.
 * 2) SKUTEČNÝ VÝDAJ (Expense) - konkrétní záznam pro daný měsíc, co appka
 *    buď vygenerovala automaticky (podle šablony v době, kdy appka
 *    generovala), nebo appka umožní ho ručně opravit - třeba když byl
 *    nájem ten konkrétní měsíc výjimečně jiný, aniž by se měnila
 *    budoucí cena v šabloně.
 *
 * Přirovnání: šablona je "recept na cenu", skutečný výdaj je "účtenka" -
 * účtenka z února může ukazovat jinou částku, než jaký recept platí dnes,
 * pokud jsi cenu mezitím změnil.
 */
import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import Modal from '../components/Modal';
import ExpenseCategoryForm from '../components/ExpenseCategoryForm';
import ExpenseAmountForm from '../components/ExpenseAmountForm';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { createExpenseCategory, updateExpenseCategory, deleteExpenseCategory } from '../api/expenseCategoryApi';
import { updateExpense, deleteExpense, generateFixedExpenses } from '../api/expenseApi';

const SKUPINA_FIXNI = 'Fixní náklady';
const SKUPINA_PREDPLATNE = 'Předplatné';

/**
 * Vyfiltruje ze všech výdajů jen ty, co patří do dané skupiny
 * A zároveň mají datum spadající do vybraného měsíce/roku.
 * new Date(e.date).getMonth() vrací 0-11, appka proto přičítá 1,
 * aby to sedělo na běžné číslování měsíců 1-12.
 */
function filterExpensesForMonth(expenses, group, month, year) {
  return expenses.filter((e) => {
    if (e.expenseCategory?.categoryGroup !== group) return false;
    const expenseDate = new Date(e.date);
    return expenseDate.getFullYear() === year && expenseDate.getMonth() + 1 === month;
  });
}

/**
 * Jedna sekce (Fixní náklady NEBO Předplatné) - zobrazuje šablony
 * (pro správu) i skutečné výdaje za vybraný měsíc (pro kontrolu/opravu).
 */
function CategoryGroupSection({
  title, group, categories, expenses, selectedMonth, selectedYear,
  onAddTemplate, onEditTemplate, onDeleteTemplate,
  onEditExpense, onDeleteExpense,
  refetchAll,
}) {
  const [isGenerating, setIsGenerating] = useState(false);

  const templates = categories.filter((c) => c.categoryGroup === group);
  const monthlyExpenses = filterExpensesForMonth(expenses, group, selectedMonth, selectedYear);
  const monthlyTotal = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

  async function handleGenerate() {
    setIsGenerating(true);
    await generateFixedExpenses(selectedYear, selectedMonth);
    setIsGenerating(false);
    await refetchAll();
  }

  return (
    <div style={{ marginBottom: '28px' }}>
      <div className="section-label">{title}</div>

      {/* Skutečné výdaje za vybraný měsíc - to, co appka SKUTEČNĚ zaplatila */}
      <div className="glass-card" style={{ marginBottom: '10px' }}>
        <strong style={{ fontSize: '0.75rem', color: '#6b7280' }}>
          SKUTEČNÉ VÝDAJE ZA {selectedMonth}/{selectedYear}
        </strong>
        {monthlyExpenses.length === 0 && (
          <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '6px' }}>
            Pro tenhle měsíc zatím nejsou žádné záznamy.
          </p>
        )}
        {monthlyExpenses.map((expense) => (
          <div key={expense.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <span style={{ fontSize: '0.85rem' }}>{expense.expenseCategory?.label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{expense.amount} Kč</span>
              <button className="btn-edit" onPointerDown={(e) => e.stopPropagation()} onClick={() => onEditExpense(expense)}>✏️</button>
              <button className="btn-delete" onPointerDown={(e) => e.stopPropagation()} onClick={() => onDeleteExpense({ id: expense.id, name: expense.expenseCategory?.label })}>🗑</button>
            </div>
          </div>
        ))}
        {monthlyExpenses.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', fontWeight: 700, fontSize: '0.9rem' }}>
            <span>Celkem tento měsíc</span>
            <span>{monthlyTotal} Kč</span>
          </div>
        )}
      </div>

      {/* Správa šablon - ovlivňuje jen BUDOUCÍ generování, ne už existující výdaje */}
      <details>
        <summary style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', marginBottom: '8px' }}>
          ⚙️ Spravovat šablony ({templates.length})
        </summary>

        <button className="btn-add" onPointerDown={(e) => e.stopPropagation()} onClick={() => onAddTemplate(group)}>
          + Nová šablona
        </button>
        <button
          className="btn-add"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={handleGenerate}
          disabled={isGenerating}
          style={{ marginLeft: '8px', opacity: isGenerating ? 0.6 : 1 }}
        >
          {isGenerating ? 'Ukládám...' : `🔄 Znovu zapsat pro ${selectedMonth}/${selectedYear}`}
        </button>

        <div className="glass-card" style={{ marginTop: '8px' }}>
          {templates.map((template) => (
            <div key={template.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <span style={{ fontSize: '0.85rem' }}>{template.label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{template.amount} Kč</span>
                <button className="btn-edit" onPointerDown={(e) => e.stopPropagation()} onClick={() => onEditTemplate(template)}>✏️</button>
                <button className="btn-delete" onPointerDown={(e) => e.stopPropagation()} onClick={() => onDeleteTemplate({ id: template.id, name: template.label })}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}

function FixniNakladySlide() {
  const { expenseCategories, expenses, selectedMonth, selectedYear, refetchAll, isLoading, error } = useContext(AppContext);

  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [activeGroup, setActiveGroup] = useState(SKUPINA_FIXNI);

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  if (isLoading) return <p style={{ color: 'white' }}>Načítám...</p>;
  if (error) return <p style={{ color: 'white' }}>Chyba: {error}</p>;

  function openAddTemplate(group) {
    setActiveGroup(group);
    setEditingTemplate(null);
    setIsTemplateModalOpen(true);
  }

  function openEditTemplate(template) {
    setActiveGroup(template.categoryGroup);
    setEditingTemplate(template);
    setIsTemplateModalOpen(true);
  }

  async function handleSubmitTemplate(data) {
    if (editingTemplate) {
      await updateExpenseCategory(editingTemplate.id, data);
    } else {
      await createExpenseCategory(data);
    }
    setIsTemplateModalOpen(false);
    setEditingTemplate(null);
    await refetchAll();
  }

  async function handleConfirmDeleteTemplate() {
    await deleteExpenseCategory(templateToDelete.id);
    setTemplateToDelete(null);
    await refetchAll();
  }

  function openEditExpense(expense) {
    setEditingExpense(expense);
    setIsExpenseModalOpen(true);
  }

  async function handleSubmitExpense(data) {
    await updateExpense(editingExpense.id, data);
    setIsExpenseModalOpen(false);
    setEditingExpense(null);
    await refetchAll();
  }

  async function handleConfirmDeleteExpense() {
    await deleteExpense(expenseToDelete.id);
    setExpenseToDelete(null);
    await refetchAll();
  }

  return (
    <div className="slide">
      <div className="eyebrow">Sekce</div>
      <h2 className="section-title">Fixní náklady a Předplatné</h2>

      <CategoryGroupSection
        title="Fixní náklady"
        group={SKUPINA_FIXNI}
        categories={expenseCategories}
        expenses={expenses}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onAddTemplate={openAddTemplate}
        onEditTemplate={openEditTemplate}
        onDeleteTemplate={setTemplateToDelete}
        onEditExpense={openEditExpense}
        onDeleteExpense={setExpenseToDelete}
        refetchAll={refetchAll}
      />

      <CategoryGroupSection
        title="Předplatné"
        group={SKUPINA_PREDPLATNE}
        categories={expenseCategories}
        expenses={expenses}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onAddTemplate={openAddTemplate}
        onEditTemplate={openEditTemplate}
        onDeleteTemplate={setTemplateToDelete}
        onEditExpense={openEditExpense}
        onDeleteExpense={setExpenseToDelete}
        refetchAll={refetchAll}
      />

      <Modal isOpen={isTemplateModalOpen} onClose={() => setIsTemplateModalOpen(false)} title={editingTemplate ? 'Upravit šablonu' : 'Nová šablona'}>
        <ExpenseCategoryForm onSubmit={handleSubmitTemplate} initialValues={editingTemplate} categoryGroup={activeGroup} type="FIXNI" />
      </Modal>

      <ConfirmDeleteModal
        isOpen={templateToDelete !== null}
        onClose={() => setTemplateToDelete(null)}
        onConfirm={handleConfirmDeleteTemplate}
        itemName={templateToDelete?.name}
      />

      <Modal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} title="Upravit výdaj za tento měsíc">
        <ExpenseAmountForm onSubmit={handleSubmitExpense} initialValues={editingExpense} />
      </Modal>

      <ConfirmDeleteModal
        isOpen={expenseToDelete !== null}
        onClose={() => setExpenseToDelete(null)}
        onConfirm={handleConfirmDeleteExpense}
        itemName={expenseToDelete?.name}
      />
    </div>
  );
}

export default FixniNakladySlide;