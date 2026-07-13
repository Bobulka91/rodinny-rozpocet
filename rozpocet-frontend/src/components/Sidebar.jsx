/**
 * Levé navigační menu appky (na mobilu se přes CSS media query
 * mění na vodorovný pruh nahoře - viz .sidebar v index.css).
 */
function Sidebar({ active, onChange }) {
  const items = [
    { key: 'prehled', label: 'Přehled', icon: '📊' },
    { key: 'prijemVydaj', label: 'Příjem / Výdaj', icon: '💸' },
    { key: 'sporeniDluh', label: 'Spoření / Dluh', icon: '🎯' },
    { key: 'analyza', label: 'Analýza / Historie', icon: '📈' },
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