import { CARGOS, AREAS, LIDERES, CLIENTES } from '../../../config/lists';

export function Section1({ data, errors, onChange, onNext, stepDots }) {
  const set = (key, val) => onChange(key, val);

  const toggleCliente = (cliente) => {
    const current = data.clientesSeleccionados || [];
    const next = current.includes(cliente)
      ? current.filter(c => c !== cliente)
      : [...current, cliente];
    set('clientesSeleccionados', next);
  };

  return (
    <div className="card" style={{ animation: 'fadeUp 0.4s ease both' }}>
      <div className="section-header">
        <div className="section-number">01</div>
        <div>
          <h2>Información del Empleado</h2>
          <p style={{ fontSize: 12, color: 'var(--white-muted)', fontFamily: 'var(--font-mono)' }}>Identificación y ubicación</p>
        </div>
      </div>

      <div className="section-body">
        <div className="two-col">
          <div className="field">
            <label className="field-label">Nombre completo <span className="required">*</span></label>
            <input type="text" value={data.nombreCompleto || ''} readOnly className={errors.nombreCompleto ? 'invalid' : ''} />
            {errors.nombreCompleto && <p className="field-error">{errors.nombreCompleto}</p>}
          </div>
          <div className="field">
            <label className="field-label">Documento de identidad <span className="required">*</span></label>
            <input
              type="number"
              value={data.documento || ''}
              onChange={e => set('documento', e.target.value)}
              className={errors.documento ? 'invalid' : ''}
            />
            {errors.documento && <p className="field-error">{errors.documento}</p>}
          </div>
        </div>

        <div className="field">
          <label className="field-label">Correo corporativo <span className="required">*</span></label>
          <input type="email" value={data.correo || ''} readOnly className={errors.correo ? 'invalid' : ''} />
          {errors.correo && <p className="field-error">{errors.correo}</p>}
        </div>

        <div className="two-col">
          <div className="field">
            <label className="field-label">Cargo <span className="required">*</span></label>
            <select value={data.cargo || ''} onChange={e => set('cargo', e.target.value)} className={errors.cargo ? 'invalid' : ''}>
              <option value="" disabled>Selecciona un cargo...</option>
              {CARGOS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.cargo && <p className="field-error">{errors.cargo}</p>}
          </div>
          <div className="field">
            <label className="field-label">Área <span className="required">*</span></label>
            <select value={data.area || ''} onChange={e => set('area', e.target.value)} className={errors.area ? 'invalid' : ''}>
              <option value="" disabled>Selecciona un área...</option>
              {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            {errors.area && <p className="field-error">{errors.area}</p>}
          </div>
        </div>

        <div className="field">
          <label className="field-label">Líder inmediato <span className="required">*</span></label>
          <select value={data.lider || ''} onChange={e => set('lider', e.target.value)} className={errors.lider ? 'invalid' : ''}>
            <option value="" disabled>Selecciona un líder...</option>
            {LIDERES.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          {errors.lider && <p className="field-error">{errors.lider}</p>}
        </div>

        <div className="field">
          <label className="field-label">¿Actualmente se encuentra asignado a clientes? <span className="required">*</span></label>
          <div className="option-group inline">
            {['Si', 'No'].map(v => (
              <label key={v} className="option-item" style={errors.asignadoProyectos ? { borderColor: 'rgba(255,71,87,0.5)' } : {}}>
                <input type="radio" name="asignadoProyectos" value={v} checked={data.asignadoProyectos === v} onChange={() => set('asignadoProyectos', v)} />
                <span>{v === 'Si' ? 'Sí' : 'No'}</span>
              </label>
            ))}
          </div>
          {errors.asignadoProyectos && <p className="field-error">{errors.asignadoProyectos}</p>}
        </div>

        {data.asignadoProyectos === 'Si' && (
          <div style={{ borderLeft: '2px solid var(--cyan)', paddingLeft: 16, marginTop: 8 }}>
            <div className="field">
              <label className="field-label">¿A cuáles clientes? <span className="required">*</span></label>
              <div className="list-group">
                {CLIENTES.filter(c => c !== 'OTRO').map(c => (
                  <div
                    key={c}
                    className={`list-item ${(data.clientesSeleccionados || []).includes(c) ? 'selected' : ''}`}
                    style={errors.clientesSeleccionados ? { borderColor: 'rgba(255,71,87,0.5)' } : {}}
                    onClick={() => toggleCliente(c)}
                  >
                    {c}
                  </div>
                ))}
              </div>
              {errors.clientesSeleccionados && <p className="field-error">{errors.clientesSeleccionados}</p>}
            </div>
            <div className="field">
              <label className="field-label">Si el cliente no está en la lista, agrégalo aquí (separados por comas):</label>
              <input
                type="text"
                placeholder="Ej. Cliente A, Cliente B"
                value={data.clientesManuales || ''}
                onChange={e => set('clientesManuales', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      <div className="nav-buttons">
        {stepDots}
        <button className="btn btn-primary" onClick={onNext}>
          Continuar
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>
    </div>
  );
}
