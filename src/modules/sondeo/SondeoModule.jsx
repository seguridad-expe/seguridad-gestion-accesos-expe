import { useState, useCallback } from 'react';
import { APPS_SCRIPT_SONDEO } from '../../config/env';
import { Section1 } from './sections/Section1';
import { Section2 } from './sections/Section2';
import { Section3 } from './sections/Section3';
import { Section4 } from './sections/Section4';
import { Section5 } from './sections/Section5';
import { AppModal } from './components/AppModal';
import './SondeoModule.css';

const TOTAL = 5;

function validate(section, formData, corpApps, clientApps) {
  const errors = {};

  if (section === 1) {
    if (!formData.documento?.trim()) errors.documento = '⚠ Campo obligatorio';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo || '')) errors.correo = '⚠ Correo inválido';
    if (!formData.cargo)  errors.cargo  = '⚠ Campo obligatorio';
    if (!formData.area)   errors.area   = '⚠ Campo obligatorio';
    if (!formData.lider)  errors.lider  = '⚠ Campo obligatorio';
    if (!formData.asignadoProyectos) errors.asignadoProyectos = '⚠ Selecciona una opción';
    if (formData.asignadoProyectos === 'Si') {
      const selected = formData.clientesSeleccionados || [];
      const manual   = (formData.clientesManuales || '').trim();
      if (!selected.length && !manual) errors.clientesSeleccionados = '⚠ Selecciona al menos un cliente o escríbelo manualmente';
    }
  }

  if (section === 2 && !corpApps.length) {
    errors.corpApps = '⚠ Agrega al menos un aplicativo corporativo';
  }

  if (section === 3 && !clientApps.length) {
    errors.clientApps = '⚠ Agrega al menos un aplicativo de cliente';
  }

  if (section === 4) {
    ['mismaContrasena', 'usaBaul', 'compartidoCredenciales', 'accesosSobrantes', 'appsPersonales']
      .forEach(k => { if (!formData[k]) errors[k] = '⚠ Selecciona una opción'; });
    if (formData.usaBaul === 'Si' && !(formData.cualBaul || '').trim()) errors.cualBaul = '⚠ Campo obligatorio';
    if (formData.accesosSobrantes === 'Si' && !(formData.cualesAccesos || '').trim()) errors.cualesAccesos = '⚠ Campo obligatorio';
  }

  return errors;
}

function StepDots({ current, total }) {
  return (
    <div className="step-dots">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className={`step-dot ${i + 1 === current ? 'active' : i + 1 < current ? 'done' : ''}`} />
      ))}
    </div>
  );
}

export function SondeoModule({ user }) {
  const [section, setSection]     = useState(1);
  const [formData, setFormData]   = useState({ nombreCompleto: user.name, correo: user.email });
  const [corpApps, setCorpApps]   = useState([]);
  const [clientApps, setClientApps] = useState([]);
  const [errors, setErrors]       = useState({});
  const [modal, setModal]         = useState(null); // 'corp' | 'client' | null
  const [declaration, setDeclaration] = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [refCode, setRefCode]         = useState('');

  const setField = useCallback((key, val) => {
    setFormData(prev => ({ ...prev, [key]: val }));
    setErrors(prev => { const next = { ...prev }; delete next[key]; return next; });
  }, []);

  function goNext() {
    const errs = validate(section, formData, corpApps, clientApps);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSection(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goPrev() {
    setErrors({});
    setSection(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleModalSave(row) {
    if (modal === 'corp')   setCorpApps(prev => [...prev, row]);
    if (modal === 'client') setClientApps(prev => [...prev, row]);
    setModal(null);
    setErrors(prev => {
      const next = { ...prev };
      delete next[modal === 'corp' ? 'corpApps' : 'clientApps'];
      return next;
    });
  }

  function handleSubmit() {
    const ref = 'AUD-' + Date.now().toString(36).toUpperCase();
    const ts  = new Date().toISOString();

    const g = (k) => formData[k] || '';

    let clientesValue = g('asignadoProyectos');
    if (clientesValue === 'Si') {
      const all = [...(formData.clientesSeleccionados || []), ...(g('clientesManuales').split(',').map(c => c.trim()).filter(Boolean))];
      clientesValue = `Sí (${all.join(', ') || 'Ninguno'})`;
    }

    const payload = {
      timestamp: ts,
      referencia: ref,
      seccion1: { documento: g('documento'), nombreCompleto: g('nombreCompleto'), correo: g('correo'), cargo: g('cargo'), area: g('area'), lider: g('lider'), asignadoProyectos: clientesValue },
      seccion2_detalles: corpApps.map(a => ({ nombre: a.app, clienteAsociado: 'EXPERIMENTALITY', rol: a.rol, liderResponsable: a.lider, mfa: a.mfa })),
      seccion3_detalles: clientApps.map(a => ({ nombre: a.app, nombreCliente: a.empresa, rol: a.rol, liderResponsable: a.lider, tipoCuenta: a.cuenta, mfa: a.mfa })),
      seccion4_seguridad: { mismaContrasena: g('mismaContrasena'), usaBaul: g('usaBaul'), cualBaul: g('usaBaul') === 'Si' ? g('cualBaul') : '', compartidoCredenciales: g('compartidoCredenciales'), accesosSobrantes: g('accesosSobrantes'), cualesAccesos: g('cualesAccesos'), appsPersonales: g('appsPersonales') },
      declaracionAceptada: true,
    };

    if (!APPS_SCRIPT_SONDEO) {
      alert('Error de configuración: la URL del servidor no está definida.');
      return;
    }

    setSubmitting(true);

    let iframe = document.getElementById('sondeo_iframe');
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'sondeo_iframe';
      iframe.name = 'sondeo_iframe';
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
    }

    let form = document.getElementById('sondeo_form');
    if (form) form.remove();
    form = document.createElement('form');
    form.id = 'sondeo_form';
    form.method = 'POST';
    form.action = APPS_SCRIPT_SONDEO;
    form.target = 'sondeo_iframe';
    form.style.display = 'none';
    const input = document.createElement('input');
    input.name = 'payload';
    input.value = JSON.stringify(payload);
    form.appendChild(input);
    document.body.appendChild(form);

    const handler = (event) => {
      if (typeof event.data === 'string' && event.data.startsWith('FORM_OK')) {
        window.removeEventListener('message', handler);
        setRefCode(ref);
        setSubmitted(true);
        setSubmitting(false);
      } else if (typeof event.data === 'string' && event.data.startsWith('FORM_ERROR')) {
        window.removeEventListener('message', handler);
        alert('Error al enviar: ' + event.data.split(':')[1]);
        setSubmitting(false);
      }
    };
    window.addEventListener('message', handler);
    form.submit();

    setTimeout(() => {
      window.removeEventListener('message', handler);
      setSubmitting(false);
      alert('No se recibió respuesta del servidor. Verifica que el formulario fue enviado.');
    }, 15000);
  }

  const pct = Math.round(((section - 1) / TOTAL) * 100);
  const dots = <StepDots current={section} total={TOTAL} />;

  if (submitted) {
    return (
      <div className="success-screen" style={{ animation: 'fadeUp 0.5s ease both' }}>
        <div className="success-icon">✓</div>
        <h2 style={{ color: 'var(--green)', marginBottom: 12 }}>¡Formulario enviado!</h2>
        <p style={{ color: 'var(--white-dim)', fontSize: 14, lineHeight: 1.7, maxWidth: 440, margin: '0 auto 20px' }}>
          Tu auditoría de accesos ha sido registrada con éxito.
        </p>
        <div className="ref-code">REF: {refCode}</div>
      </div>
    );
  }

  return (
    <div className="sondeo-module">
      {section === 1 && (
        <div className="sondeo-intro">
          <div className="sondeo-badge">
            <span className="sondeo-badge-dot" />
            Auditoría de Seguridad · Confidencial
          </div>
          <h1>Sondeo de Validación de <span style={{ color: 'var(--cyan)' }}>Accesos</span></h1>
          <p className="sondeo-desc">
            El objetivo de este sondeo es garantizar que cada integrante del equipo cuente con los permisos adecuados
            para desempeñar su labor de forma segura y eficiente.
          </p>
        </div>
      )}

      <div className="progress-bar-wrap">
        <div className="progress-info">
          <span className="progress-label">SECCIÓN {section} DE {TOTAL}</span>
          <span className="progress-pct">{pct}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: pct + '%' }} />
        </div>
      </div>

      {section === 1 && <Section1 data={formData} errors={errors} onChange={setField} onNext={goNext} stepDots={dots} />}
      {section === 2 && <Section2 corpApps={corpApps} errors={errors} onDelete={i => setCorpApps(prev => prev.filter((_, idx) => idx !== i))} onAdd={() => setModal('corp')} onNext={goNext} onPrev={goPrev} stepDots={dots} />}
      {section === 3 && <Section3 clientApps={clientApps} errors={errors} onDelete={i => setClientApps(prev => prev.filter((_, idx) => idx !== i))} onAdd={() => setModal('client')} onNext={goNext} onPrev={goPrev} stepDots={dots} />}
      {section === 4 && <Section4 data={formData} errors={errors} onChange={setField} onNext={goNext} onPrev={goPrev} stepDots={dots} />}
      {section === 5 && <Section5 formData={formData} corpApps={corpApps} clientApps={clientApps} declaration={declaration} onDeclarationChange={setDeclaration} onSubmit={handleSubmit} onPrev={goPrev} submitting={submitting} />}

      {modal && <AppModal type={modal} onSave={handleModalSave} onClose={() => setModal(null)} />}
    </div>
  );
}
