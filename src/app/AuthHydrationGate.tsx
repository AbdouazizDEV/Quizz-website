import { useEffect, useState, type ReactNode } from 'react';
import { runAuthBootstrapAndSyncStore } from '@services/auth/authSessionController';

export function AuthHydrationGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void runAuthBootstrapAndSyncStore().finally(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div style={{ minHeight: '100svh', display: 'grid', placeItems: 'center', background: '#fff' }}>
        <div style={{ textAlign: 'center' }}>
          <img src="/assets/icons/logo.png" alt="Quizz+" width={80} height={80} />
          <p style={{ fontWeight: 800, marginTop: 12 }}>Quizz+</p>
        </div>
      </div>
    );
  }

  return children;
}
