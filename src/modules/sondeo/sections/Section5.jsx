export function Section5({ formData, corpApps, clientApps, declaration, onDeclarationChange, onSubmit, onPrev, submitting }) {
  const v = (key) => formData[key] || '—';
  const siNo = (val) => val === 'Si' ? 'Sí' : val === 'No' ? 'No' : val || '—';

  let clientesText = v('asignadoProyectos');
  if (clientesText === 'Si') {
    const selected = formData.clientesSeleccionados || [];
    const manual = formData.clientesManuales || '';
    const all = [...selected, ...manual.split(',').map(c => c.trim()).filter(Boolean)];
    clientesText = `Sí (${all.join(', ') || 'Ninguno'})`;
  } else if (clientesText === 'No') {
    clientesText = 'No';
  }

  let baulText = v('usaBaul');
  if (baulText === 'Si') baulText = `Sí (${v('cualBaul')})`;
  else if (baulText === 'No') baulText = 'No';

  let sobrantesText = v('accesosSobrantes');
  if (sobrantesText === 'Si') sobrantesText = `Sí (${v('cualesAccesos')})`;
  else if (sobrantesText === 'No') sobrantesText = 'No';

  const Row = ({ label, value }) => (
    <div style={{ marginBottom: 4 }}>
      <span style={{ color: 'var(--white-muted)' }}>{label}: </span>
      <span style={{ color: 'var(--white-dim)' }}>{value}</span>
    </div>
  );

  return (
    <div className="card" style={{ animation: 'fadeUp 0.4s ease both' }}>
      <div className="section-header">
        <div className="section-number">05</div>
        <div>
          <h2>Confirmación</h2>
          <p style={{ fontSize: 12, color: 'var(--white-muted)', fontFamily: 'var(--font-mono)' }}>Resumen y envío</p>
        </div>
      </div>

      <div className="section-body">
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 10, padding: 20, fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.8, marginBottom: 24 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ color: 'var(--cyan)', fontWeight: 700, marginBottom: 6 }}>[ EMPLEADO ]</div>
            <Row label="Nombre" value={v('nombreCompleto')} />
            <Row label="Documento" value={v('documento')} />
            <Row label="Correo" value={v('correo')} />
            <Row label="Cargo" value={v('cargo')} />
            <Row label="Área" value={v('area')} />
            <Row label="Líder" value={v('lider')} />
            <Row label="Asignado a clientes" value={clientesText} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ color: 'var(--cyan)', fontWeight: 700, marginBottom: 6 }}>[ APLICATIVOS ]</div>
            <Row label="Corporativos" value={corpApps.map(r => r.app).join(', ') || 'Ninguno'} />
            <Row label="Clientes" value={clientApps.map(r => r.app).join(', ') || 'Ninguno'} />
          </div>
          <div>
            <div style={{ color: 'var(--cyan)', fontWeight: 700, marginBottom: 6 }}>[ SEGURIDAD ]</div>
            <Row label="Misma contraseña" value={siNo(v('mismaContrasena'))} />
            <Row label="Baúl contraseñas" value={baulText} />
            <Row label="Compartió credenciales" value={siNo(v('compartidoCredenciales'))} />
            <Row label="Accesos sobrantes" value={sobrantesText} />
            <Row label="Apps personales" value={siNo(v('appsPersonales'))} />
          </div>
        </div>

        <label style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: 'rgba(45,232,176,0.06)', border: '1px solid rgba(45,232,176,0.2)', borderRadius: 10, padding: '18px 20px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={declaration}
            onChange={e => onDeclarationChange(e.target.checked)}
            style={{ width: 18, height: 18, accentColor: 'var(--green)', marginTop: 2, flexShrink: 0, cursor: 'pointer' }}
          />
          <p style={{ fontSize: 13, lineHeight: 1.6, color: 'rgba(0,229,160,0.85)', fontStyle: 'italic', margin: 0 }}>
            Confirmo que la información suministrada es veraz y corresponde a los accesos que actualmente poseo.
          </p>
        </label>
      </div>

      <div className="nav-buttons">
        <button className="btn btn-ghost" onClick={onPrev} disabled={submitting}>Anterior</button>
        <button className="btn btn-success" onClick={onSubmit} disabled={!declaration || submitting}>
          {submitting ? 'Enviando...' : 'Enviar Formulario'}
        </button>
      </div>
    </div>
  );
}
