import { AppTable } from '../components/AppTable';

export function Section3({ clientApps, errors, onDelete, onAdd, onNext, onPrev, stepDots }) {
  return (
    <div className="card fullscreen-section" style={{ animation: 'fadeUp 0.4s ease both' }}>
      <div className="section-header">
        <div className="section-number">03</div>
        <div>
          <h2>Aplicativos del Cliente</h2>
          <p style={{ fontSize: 12, color: 'var(--white-muted)', fontFamily: 'var(--font-mono)' }}>Acceso a herramientas del cliente</p>
        </div>
      </div>

      <div className="section-body">
        <div className="field">
          <label className="field-label">
            ¿A cuáles aplicativos del cliente tienes acceso?{' '}
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', background: 'var(--cyan-dim)', color: 'var(--cyan)', border: '1px solid rgba(45,232,176,0.2)', borderRadius: 4, padding: '1px 6px', letterSpacing: '0.04em', textTransform: 'uppercase', verticalAlign: 'middle' }}>
              Registro por aplicativo
            </span>
          </label>
          <AppTable rows={clientApps} type="client" onDelete={onDelete} onAdd={onAdd} />
          {errors.clientApps && <p className="field-error" style={{ marginTop: 10 }}>{errors.clientApps}</p>}
        </div>
      </div>

      <div className="nav-buttons">
        <button className="btn btn-ghost" onClick={onPrev}>Anterior</button>
        {stepDots}
        <button className="btn btn-primary" onClick={onNext}>Continuar</button>
      </div>
    </div>
  );
}
