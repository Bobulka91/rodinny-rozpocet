/**
 * Levé navigační menu appky. Po restrukturalizaci má 6 sekcí -
 * Přehled je čistě read-only, zbytek je rozdělený podle skupin.
 */
function Sidebar({ active, onChange }) {
  const items = [
    { key: 'prehled', label: 'Přehled', icon: '📊' },
    { key: 'prijem', label: 'Příjem', icon: '💼' },
    { key: 'fixni', label: 'Fixní náklady', icon: '🏠' },
    { key: 'denni', label: 'Každodenní výdaje', icon: '🛒' },
    { key: 'usporyDluh', label: 'Úspory / Dluh', icon: '🎯' },
  ];

  return (
    <nav className="sidebar">
      <div className="sidebar-title">Rodinný rozpočet</div>
      {items.map((item) => (
        <button
          key={item.key}
          className={`sidebar-item ${active === item.key ? 'active' : ''}`}
          onClick={() => onChange(item.key)}
        >
          <span className="sidebar-icon">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  );
}

export default Sidebar;