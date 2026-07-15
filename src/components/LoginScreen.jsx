import './LoginScreen.css';

export function LoginScreen({ onSignIn, error, loading }) {
  return (
    <div className="login-screen">
      <div className="login-glow" />

      <div className="login-card">
        <div className="login-logo">
          <span className="login-logo-bracket">[</span>
          <span className="login-logo-text">EXPERIMENTALITY</span>
          <span className="login-logo-bracket">]</span>
        </div>

        <div className="login-badge">
          <span className="login-badge-dot" />
          GESTIÓN DE ACCESOS
        </div>

        <h1 className="login-title">
          Bienvenido al<br />
          <span className="login-title-accent">Portal de Accesos</span>
        </h1>

        <p className="login-desc">
          Acceso exclusivo con cuenta corporativa.<br />
          Sondeo de validación y solicitudes en un solo lugar.
        </p>

        {error && (
          <div className="login-error">{error}</div>
        )}

        <button
          className="login-google-btn"
          onClick={onSignIn}
          disabled={loading}
        >
          {loading ? (
            <span className="login-spinner" />
          ) : (
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              width="20"
              height="20"
              alt="Google"
            />
          )}
          {loading ? 'Conectando con Google...' : 'Iniciar sesión con Google'}
        </button>

        <p className="login-footer">
          Solo cuentas corporativas autorizadas
        </p>
      </div>
    </div>
  );
}
