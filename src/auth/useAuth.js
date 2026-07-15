import { useState, useCallback } from 'react';
import { ALLOWED_DOMAIN, GOOGLE_CLIENT_ID } from '../config/env';

const ALLOWED_DOMAINS = ALLOWED_DOMAIN.split(',').map(d => d.trim()).filter(Boolean);

export function useAuth() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const signIn = useCallback(() => {
    if (typeof google === 'undefined') {
      setError('No se pudo cargar Google Sign-In. Verifica tu conexión.');
      return;
    }

    setLoading(true);
    setError('');

    const timeout = setTimeout(() => {
      setLoading(false);
      setError('La conexión con Google tardó demasiado. Intenta de nuevo.');
    }, 45000);

    const client = google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'email profile',
      callback: async (tokenResponse) => {
        clearTimeout(timeout);
        if (tokenResponse.error) {
          setError('Error al autenticar: ' + (tokenResponse.error_description || tokenResponse.error));
          setLoading(false);
          return;
        }
        try {
          const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: 'Bearer ' + tokenResponse.access_token },
          });
          const profile = await res.json();
          const email = (profile.email || '').toLowerCase();
          const domain = email.split('@')[1] || '';

          if (!ALLOWED_DOMAINS.includes(domain)) {
            setError(`❌ Acceso denegado.\n\nSolo cuentas @${ALLOWED_DOMAINS.join(', @')} pueden acceder.\nCorreo detectado: ${email}`);
            setLoading(false);
            return;
          }

          setUser({ ...profile, email });
        } catch {
          setError('No se pudo obtener el perfil. Intenta de nuevo.');
        } finally {
          setLoading(false);
        }
      },
      error_callback: (err) => {
        clearTimeout(timeout);
        setError('Error de Google Sign-In: ' + (err.message || 'Error de conexión'));
        setLoading(false);
      },
    });

    client.requestAccessToken({ prompt: 'select_account' });
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setError('');
  }, []);

  return { user, error, loading, signIn, signOut };
}
