export function AppTable({ rows, type, onDelete, onAdd }) {
  const isClient = type === 'client';

  return (
    <div>
      <button
        type="button"
        className="btn btn-ghost"
        style={{ width: '100%', justifyContent: 'center', borderStyle: 'dashed', marginBottom: rows.length ? 20 : 0 }}
        onClick={onAdd}
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ marginRight: 8 }}>
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        {isClient ? 'Agregar Aplicativo de Cliente' : 'Agregar Aplicativo Corporativo'}
      </button>

      {rows.length > 0 && (
        <div className="app-table-container">
          <div className="app-detail-title">
            {isClient ? 'APLICATIVOS DE CLIENTE REGISTRADOS' : 'APLICATIVOS CORPORATIVOS REGISTRADOS'}
          </div>
          <table className="app-table">
            <thead>
              <tr>
                <th>Aplicativo</th>
                {isClient && <th>Cliente</th>}
                <th>Rol</th>
                <th>Líder</th>
                {isClient && <th>Cuenta</th>}
                <th>MFA</th>
                <th style={{ width: 40 }} />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.app}</td>
                  {isClient && <td>{row.empresa}</td>}
                  <td>{row.rol}</td>
                  <td>{row.lider}</td>
                  {isClient && <td>{row.cuenta}</td>}
                  <td>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: row.mfa === 'Si' ? 'rgba(0,184,122,0.1)' : 'rgba(255,71,87,0.1)',
                      color: row.mfa === 'Si' ? '#00b87a' : '#ff4757',
                    }}>
                      {row.mfa}
                    </span>
                  </td>
                  <td>
                    <button className="btn-delete" onClick={() => onDelete(idx)} title="Eliminar">
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
