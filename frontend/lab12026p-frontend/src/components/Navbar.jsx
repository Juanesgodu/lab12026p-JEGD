const NAV_ITEMS = [
  { key: 'customers', label: 'Clientes' },
  { key: 'transfer', label: 'Transferencia' },
  { key: 'history', label: 'Histórico' },
];

export default function Navbar({ currentView, onNavigate }) {
  return (
    <header className="navbar">
      <div className="navbar-brand">Banco UdeA · Lab 1</div>
      <nav className="navbar-links">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            className={
              'navbar-link' + (currentView === item.key ? ' navbar-link-active' : '')
            }
            onClick={() => onNavigate(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
