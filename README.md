# Gestión de Accesos — Experimentality

Aplicación web interna para auditar y solicitar accesos a aplicativos corporativos y de clientes. Restringida a cuentas `@experimentality.co`.

---

## Módulos

### Sondeo de Validación de Accesos
Formulario de auditoría en 5 secciones donde cada integrante del equipo declara sus accesos actuales y responde preguntas de higiene de seguridad:

1. **Datos personales** — documento, cargo, área, líder y proyectos asignados
2. **Aplicativos corporativos** — accesos internos de Experimentality (app, rol, líder, MFA)
3. **Aplicativos de clientes** — accesos en cuentas de clientes (app, empresa, tipo de cuenta, MFA)
4. **Seguridad** — uso de contraseñas repetidas, gestor de contraseñas, credenciales compartidas y accesos sobrantes
5. **Declaración y envío** — resumen y firma de veracidad

Al enviar se genera un código de referencia `AUD-XXXXXXXX`.

### Portal de Solicitud de Accesos
Formulario simple para pedir un acceso nuevo a un aplicativo. El responsable recibe notificación automática por correo.

---

## Autenticación

Google OAuth 2.0 (Google Identity Services). Solo se permite el ingreso a cuentas del dominio `@experimentality.co`. El perfil del usuario (nombre y correo) se carga automáticamente en los formularios.

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + Vite |
| Estilos | CSS modular por componente |
| Auth | Google Identity Services (GSI) |
| Backend | Google Apps Script (2 scripts independientes) |
| Deploy | GitHub Pages |
| CI/CD | GitHub Actions |

---

## Variables de entorno

Copia `.env.example` a `.env` y completa los valores:

```
VITE_GOOGLE_CLIENT_ID=        # Client ID de Google Cloud Console
VITE_ALLOWED_DOMAIN=          # Dominio permitido (experimentality.co)
VITE_APPS_SCRIPT_SONDEO=      # URL del Apps Script del módulo Sondeo
VITE_APPS_SCRIPT_PORTAL=      # URL del Apps Script del módulo Portal
```

El archivo `.env` nunca se commitea. En producción, estas variables se configuran como **Secrets** en GitHub Actions.

---

## Desarrollo local

```bash
npm install
npm run dev
```

---

## Deploy

Cada push a `main` dispara el workflow de GitHub Actions que construye la app e inyecta las variables desde los secrets del repositorio, y despliega automáticamente en GitHub Pages.

Para habilitarlo por primera vez:
1. Ve a **Settings → Pages** y selecciona **GitHub Actions** como fuente
2. Ve a **Settings → Secrets and variables → Actions** y agrega los 4 secrets del `.env.example`
