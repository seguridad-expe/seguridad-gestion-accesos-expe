import { useState, useEffect } from 'react';
import { APLICACIONES, ROLES, LIDERES, CLIENTES } from '../../../config/lists';
import './AppModal.css';

const EMPTY = {
  appSelect: '', appManual: '',
  roleSelect: '', roleManual: '',
  leader: '',
  clientSelect: '', clientManual: '',
  accountType: '',
  mfa: '',
};

export function AppModal({ type, onSave, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(EMPTY);
    setError('');
  }, [type]);

  const isClient = type === 'client';
  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));

  function handleSave() {
    const app  = form.appSelect  === 'OTRO' ? form.appManual.trim()  : form.appSelect;
    const rol  = form.roleSelect === 'OTRO' ? form.roleManual.trim() : form.roleSelect;
    const lider = form.leader;
    const mfa  = form.mfa;

    let empresa = 'EXPERIMENTALITY';
    let cuenta  = '';

    if (isClient) {
      empresa = form.clientSelect === 'OTRO' ? form.clientManual.trim() : form.clientSelect;
      cuenta  = form.accountType;
    }

    if (!app || !rol || !lider || !mfa || (isClient && (!empresa || !cuenta))) {
      setError('Por favor completa todos los campos obligatorios.');
      return;
    }

    onSave({ app, rol, lider, mfa, empresa, cuenta, tipo: isClient ? 'Cliente' : 'Corporativo' });
  }

  return (
    <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>{isClient ? 'Nuevo Aplicativo de Cliente' : 'Nuevo Aplicativo Corporativo'}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          {isClient && (
            <div className="field">
              <label className="field-label">Empresa / Cliente <span className="required">*</span></label>
              <select
                value={form.clientSelect}
                onChange={e => set('clientSelect', e.target.value)}
              >
                <option value="" disabled>Selecciona un cliente...</option>
                {CLIENTES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {form.clientSelect === 'OTRO' && (
                <input
                  style={{ marginTop: 10 }}
                  type="text"
                  placeholder="Escribe el nombre de la empresa"
                  value={form.clientManual}
                  onChange={e => set('clientManual', e.target.value)}
                />
              )}
            </div>
          )}

          <div className="field">
            <label className="field-label">Nombre del Aplicativo <span className="required">*</span></label>
            <select value={form.appSelect} onChange={e => set('appSelect', e.target.value)}>
              <option value="" disabled>Selecciona un aplicativo...</option>
              {APLICACIONES.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            {form.appSelect === 'OTRO' && (
              <input
                style={{ marginTop: 10 }}
                type="text"
                placeholder="Escribe el nombre del aplicativo"
                value={form.appManual}
                onChange={e => set('appManual', e.target.value)}
              />
            )}
          </div>

          <div className="field">
            <label className="field-label">Rol / Acceso <span className="required">*</span></label>
            <select value={form.roleSelect} onChange={e => set('roleSelect', e.target.value)}>
              <option value="" disabled>Selecciona un rol...</option>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            {form.roleSelect === 'OTRO' && (
              <input
                style={{ marginTop: 10 }}
                type="text"
                placeholder="Escribe el rol o tipo de acceso"
                value={form.roleManual}
                onChange={e => set('roleManual', e.target.value)}
              />
            )}
          </div>

          <div className="field">
            <label className="field-label">Líder Responsable <span className="required">*</span></label>
            <select value={form.leader} onChange={e => set('leader', e.target.value)}>
              <option value="" disabled>Selecciona un líder...</option>
              {LIDERES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {isClient && (
            <div className="field">
              <label className="field-label">Tipo de Cuenta <span className="required">*</span></label>
              <div className="option-group inline">
                {['Individual', 'Compartida'].map(v => (
                  <label key={v} className="option-item">
                    <input type="radio" name="modalAccountType" value={v} checked={form.accountType === v} onChange={() => set('accountType', v)} />
                    <span>{v}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="field">
            <label className="field-label">¿MFA Habilitado? <span className="required">*</span></label>
            <div className="option-group inline">
              {[['Si', 'Sí'], ['No', 'No'], ['No sabe', 'No sabe']].map(([v, l]) => (
                <label key={v} className="option-item">
                  <input type="radio" name="modalMFA" value={v} checked={form.mfa === v} onChange={() => set('mfa', v)} />
                  <span>{l}</span>
                </label>
              ))}
            </div>
          </div>

          {error && <p style={{ color: 'var(--red)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>{error}</p>}
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave}>Agregar</button>
        </div>
      </div>
    </div>
  );
}
