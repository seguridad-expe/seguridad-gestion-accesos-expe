import { AppTable } from '../components/AppTable';

export function Section2({ corpApps, errors, onDelete, onAdd, onNext, onPrev, stepDots }) {
  return (
    <div className="card fullscreen-section" style={{ animation: 'fadeUp 0.4s ease both' }}>
      <div className="section-header">
        <div className="section-number">02</div>
        <div>
          <h2>Aplicativos Corporativos</h2>
          <p style={{ fontSize: 12, color: 'var(--white-muted)', fontFamily: 'var(--font-mono)' }}>Acceso a herramientas de la empresa</p>
        </div>
      </div>

      <div className="section-body">
        <div className="field">
          <label className="field-label">
            ¿A cuáles aplicativos de Experimentality tienes acceso?{' '}
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', background: 'var(--cyan-dim)', color: 'var(--cyan)', border: '1px solid rgba(45,232,176,0.2)', borderRadius: 4, padding: '1px 6px', letterSpacing: '0.04em', textTransform: 'uppercase', verticalAlign: 'middle' }}>
              Registro por aplicativo
            </span>
          </label>
          <AppTable rows={corpApps} type="corp" onDelete={onDelete} onAdd={onAdd} />
          {errors.corpApps && <p className="field-error" style={{ marginTop: 10 }}>{errors.corpApps}</p>}
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
