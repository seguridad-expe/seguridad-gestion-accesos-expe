import { useState } from 'react';
import { APLICACIONES } from '../../config/lists';
import { APPS_SCRIPT_PORTAL } from '../../config/env';
import './PortalModule.css';

const TIPOS_ACCESO = [
  { value: 'Interno', label: '🏠 Interno (Experimentality)' },
  { value: 'Externo', label: '🌐 Externo (Cliente)' },
];

const APLICATIVOS_PORTAL = [
  'AWS', 'GCP', 'AZURE', 'GITHUB', 'GITLAB',
  'VTEX', 'SHOPIFY', 'JIRA', 'CONFLUENCE', 'FIGMA',
  'SLACK', 'MICROSOFT TEAMS', 'GOOGLE WORKSPACE', 'MICROSOFT 365',
  'OTRO',
];

const EMPTY = {
  tipoAcceso: 'Interno',
  clienteNombre: '',
  aplicativo: '',
  otroAplicativo: '',
  correoResponsableManual: '',
  justificacion: '',
};

export function PortalModule({ user }) {
  const [form, setForm]       = useState(EMPTY);
  const [errors, setErrors]   = useState({});
  const [status, setStatus]   = useState(null); // 'success' | 'error'
  const [sending, setSending] = useState(false);

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => { const n = { ...e }; delete n[key]; return n; });
  };

  function validate() {
    const errs = {};
    if (!form.clienteNombre.trim()) errs.clienteNombre = '⚠ Campo obligatorio';
    if (!form.aplicativo) errs.aplicativo = '⚠ Selecciona un aplicativo';
    if (form.aplicativo === 'OTRO') {
      if (!form.otroAplicativo.trim()) errs.otroAplicativo = '⚠ Especifica el aplicativo';
      if (!form.correoResponsableManual.trim()) errs.correoResponsableManual = '⚠ Campo obligatorio';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correoResponsableManual)) errs.correoResponsableManual = '⚠ Correo inválido';
    }
    if (!form.justificacion.trim()) errs.justificacion = '⚠ Campo obligatorio';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSending(true);
    setStatus(null);

    const aplicativoFinal = form.aplicativo === 'OTRO'
      ? `Otro: ${form.otroAplicativo.trim()}`
      : form.aplicativo;

    const payload = {
      tipo_formulario: 'solicitud_acceso',
      timestamp: new Date().toISOString(),
      nombre: user.name,
      correo: user.email,
      tipo_acceso: form.tipoAcceso,
      cliente_nombre: form.clienteNombre.trim(),
      correo_responsable_manual: form.correoResponsableManual.trim(),
      aplicativo: aplicativoFinal,
      justificacion: form.justificacion.trim(),
    };

    if (!APPS_SCRIPT_PORTAL) {
      setStatus('error');
      setSending(false);
      return;
    }

    try {
      const body = new URLSearchParams();
      body.append('payload', JSON.stringify(payload));
      await fetch(APPS_SCRIPT_PORTAL, {
        method: 'POST',
        mode: 'no-cors',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      setStatus('success');
      setForm(EMPTY);
      setErrors({});
    } catch {
      setStatus('error');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="portal-module">
      <div className="portal-intro">
        <div className="portal-badge">
          <span className="portal-badge-dot" />
          Solicitud de Accesos
        </div>
        <h1>Portal de Solicitud de <span style={{ color: 'var(--cyan)' }}>Accesos</span></h1>
        <p className="portal-desc">
          Selecciona el aplicativo y justifica tu necesidad de acceso.
          El responsable recibirá una notificación automática.
        </p>
      </div>

      {status === 'success' && (
        <div className="portal-alert portal-alert--success">
          ✅ Solicitud enviada con éxito. El responsable ha sido notificado.
        </div>
      )}
      {status === 'error' && (
        <div className="portal-alert portal-alert--error">
          ❌ Hubo un problema al conectar con el servidor. Intenta de nuevo.
        </div>
      )}

      <form className="card" onSubmit={handleSubmit} noValidate>
        <div className="section-header">
          <div className="section-number">📋</div>
          <div>
            <h2>Datos de la Solicitud</h2>
            <p style={{ fontSize: 12, color: 'var(--white-muted)', fontFamily: 'var(--font-mono)' }}>Completa todos los campos requeridos</p>
          </div>
        </div>

        <div className="section-body">
          {/* Datos del solicitante — readonly desde Google */}
          <div className="two-col">
            <div className="field">
              <label className="field-label">Nombre completo</label>
              <input type="text" value={user.name} readOnly />
            </div>
            <div className="field">
              <label className="field-label">Correo corporativo</label>
              <input type="email" value={user.email} readOnly />
            </div>
          </div>

          <div className="field">
            <label className="field-label">Tipo de acceso <span className="required">*</span></label>
            <select value={form.tipoAcceso} onChange={e => set('tipoAcceso', e.target.value)}>
              {TIPOS_ACCESO.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          <div className="field">
            <label className="field-label">Cliente / Proyecto <span className="required">*</span></label>
            <input
              type="text"
              placeholder="Ej: Éxito, Sura, D1 o Experimentality"
              value={form.clienteNombre}
              onChange={e => set('clienteNombre', e.target.value)}
              className={errors.clienteNombre ? 'invalid' : ''}
            />
            {errors.clienteNombre && <p className="field-error">{errors.clienteNombre}</p>}
          </div>

          <div className="field">
            <label className="field-label">Aplicativo al que solicitas acceso <span className="required">*</span></label>
            <select
              value={form.aplicativo}
              onChange={e => set('aplicativo', e.target.value)}
              className={errors.aplicativo ? 'invalid' : ''}
            >
              <option value="" disabled>Selecciona una opción...</option>
              {APLICATIVOS_PORTAL.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            {errors.aplicativo && <p className="field-error">{errors.aplicativo}</p>}
          </div>

          {form.aplicativo === 'OTRO' && (
            <>
              <div className="field">
                <label className="field-label">Especifica el aplicativo <span className="required">*</span></label>
                <input
                  type="text"
                  placeholder="Ej: Jira, Figma, Adobe, etc."
                  value={form.otroAplicativo}
                  onChange={e => set('otroAplicativo', e.target.value)}
                  className={errors.otroAplicativo ? 'invalid' : ''}
                />
                {errors.otroAplicativo && <p className="field-error">{errors.otroAplicativo}</p>}
              </div>

              <div className="field">
                <label className="field-label">Correo del responsable del acceso <span className="required">*</span></label>
                <input
                  type="email"
                  placeholder="responsable@cliente.com o lider@experimentality.co"
                  value={form.correoResponsableManual}
                  onChange={e => set('correoResponsableManual', e.target.value)}
                  className={errors.correoResponsableManual ? 'invalid' : ''}
                />
                <p style={{ fontSize: 11, color: 'var(--white-muted)', marginTop: 5, fontFamily: 'var(--font-mono)' }}>
                  Persona que debe recibir la notificación para crear el acceso.
                </p>
                {errors.correoResponsableManual && <p className="field-error">{errors.correoResponsableManual}</p>}
              </div>
            </>
          )}

          <div className="field">
            <label className="field-label">Justificación <span className="required">*</span></label>
            <textarea
              placeholder="Necesito acceso para desplegar la nueva funcionalidad del cliente X..."
              rows={4}
              value={form.justificacion}
              onChange={e => set('justificacion', e.target.value)}
              className={errors.justificacion ? 'invalid' : ''}
            />
            {errors.justificacion && <p className="field-error">{errors.justificacion}</p>}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={sending}>
            {sending ? 'Enviando...' : 'Enviar Solicitud'}
          </button>
        </div>
      </form>
    </div>
  );
}
