import './AppLayout.css';

const MODULES = [
  { id: 'sondeo', label: 'Sondeo de Accesos',      icon: '🔍' },
  { id: 'portal', label: 'Portal de Solicitudes',  icon: '📋' },
];

export function AppLayout({ user, activeModule, onModuleChange, onSignOut, children }) {
  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="app-header-left">
          <span className="app-header-logo">
            <span className="logo-bracket">[</span>
            <span className="logo-name">EXPERIMENTALITY</span>
            <span className="logo-bracket">]</span>
          </span>

          <nav className="app-nav">
            {MODULES.map(mod => (
              <button
                key={mod.id}
                className={`app-nav-item ${activeModule === mod.id ? 'active' : ''}`}
                onClick={() => onModuleChange(mod.id)}
              >
                <span className="nav-icon">{mod.icon}</span>
                {mod.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="user-badge">
          <img
            className="user-avatar"
            src={user.picture}
            alt={user.name}
            referrerPolicy="no-referrer"
          />
          <div className="user-meta">
            <span className="user-name">{user.name}</span>
            <button className="sign-out-btn" onClick={onSignOut}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        {children}
      </main>
    </div>
  );
}
