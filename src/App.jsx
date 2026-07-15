import { useState } from 'react';
import { useAuth } from './auth/useAuth';
import { LoginScreen } from './components/LoginScreen';
import { AppLayout } from './components/AppLayout';
import { SondeoModule } from './modules/sondeo/SondeoModule';
import { PortalModule } from './modules/portal/PortalModule';


export default function App() {
  const { user, error, loading, signIn, signOut } = useAuth();
  const [activeModule, setActiveModule] = useState('sondeo');

  if (!user) {
    return <LoginScreen onSignIn={signIn} error={error} loading={loading} />;
  }

  return (
    <AppLayout
      user={user}
      activeModule={activeModule}
      onModuleChange={setActiveModule}
      onSignOut={signOut}
    >
      {activeModule === 'sondeo' && <SondeoModule key="sondeo" user={user} />}
      {activeModule === 'portal' && <PortalModule key="portal" user={user} />}
    </AppLayout>
  );
}
