export function Section4({ data, errors, onChange, onNext, onPrev, stepDots }) {
  const set = (key, val) => onChange(key, val);

  const RadioGroup = ({ name, label, required }) => (
    <div className="field">
      <label className="field-label">{label}{required && <span className="required"> *</span>}</label>
      <div className="option-group inline">
        {['Si', 'No'].map(v => (
          <label key={v} className="option-item" style={errors[name] ? { borderColor: 'rgba(255,71,87,0.5)' } : {}}>
            <input type="radio" name={name} value={v} checked={data[name] === v} onChange={() => set(name, v)} />
            <span>{v === 'Si' ? 'Sí' : 'No'}</span>
          </label>
        ))}
      </div>
      {errors[name] && <p className="field-error">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="card" style={{ animation: 'fadeUp 0.4s ease both' }}>
      <div className="section-header">
        <div className="section-number">04</div>
        <div>
          <h2>Buenas Prácticas</h2>
          <p style={{ fontSize: 12, color: 'var(--white-muted)', fontFamily: 'var(--font-mono)' }}>Seguridad de la información</p>
        </div>
      </div>

      <div className="section-body">
        <div className="info-note" style={{ marginBottom: 24 }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>
            <strong>Nota sobre confidencialidad:</strong> Este sondeo tiene como fin identificar y mitigar riesgos de seguridad. No se tomarán medidas punitivas. Tu honestidad es clave para coordinar las mejoras necesarias.
          </span>
        </div>

        <RadioGroup name="mismaContrasena" label="¿Utiliza la misma contraseña en más de un sistema?" required />

        <RadioGroup name="usaBaul" label="¿Utiliza un baúl de contraseñas (gestor de contraseñas)?" required />

        {data.usaBaul === 'Si' && (
          <div className="field">
            <label className="field-label">¿Cuál gestor de contraseñas utiliza? <span className="required">*</span></label>
            <input
              type="text"
              placeholder="Ej. 1Password, Bitwarden, Google Password Manager"
              value={data.cualBaul || ''}
              onChange={e => set('cualBaul', e.target.value)}
              className={errors.cualBaul ? 'invalid' : ''}
            />
            {errors.cualBaul && <p className="field-error">{errors.cualBaul}</p>}
          </div>
        )}

        <RadioGroup name="compartidoCredenciales" label="¿Ha compartido credenciales?" required />

        <RadioGroup name="accesosSobrantes" label="¿Considera que tiene acceso a sistemas que ya no necesita por su labor actual?" required />

        {data.accesosSobrantes === 'Si' && (
          <div className="field">
            <label className="field-label">¿A cuáles aplicativos o carpetas ya no debería tener acceso? <span className="required">*</span></label>
            <textarea
              placeholder="Ej. Carpeta PROYECTO X, Acceso a Azure Dev..."
              value={data.cualesAccesos || ''}
              onChange={e => set('cualesAccesos', e.target.value)}
              className={errors.cualesAccesos ? 'invalid' : ''}
            />
            {errors.cualesAccesos && <p className="field-error">{errors.cualesAccesos}</p>}
          </div>
        )}

        <RadioGroup name="appsPersonales" label="¿Utiliza aplicaciones personales para el almacenamiento o envío de información corporativa?" required />
      </div>

      <div className="nav-buttons">
        <button className="btn btn-ghost" onClick={onPrev}>Anterior</button>
        {stepDots}
        <button className="btn btn-primary" onClick={onNext}>Continuar</button>
      </div>
    </div>
  );
}
