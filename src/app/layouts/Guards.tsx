import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { Routes } from '@constants/Routes';
import { authSessionService } from '@services/auth/authSessionServiceInstance';
import { readStoredRefreshToken } from '@services/auth/authTokenStorage';
import { refreshAuthSessionIfNeeded } from '@services/auth/refreshAuthSession';
import { useAuthStore } from '@stores/authStore';

export function ProtectedRoute() {
  const token = useAuthStore((s) => s.token);
  const hydrated = useAuthStore((s) => s.hydrated);
  const [recovering, setRecovering] = useState(false);

  useEffect(() => {
    if (!hydrated || token?.trim() || recovering) return;

    let cancelled = false;
    setRecovering(true);

    void (async () => {
      const refreshToken = (await readStoredRefreshToken())?.trim();
      if (!refreshToken) {
        if (!cancelled) setRecovering(false);
        return;
      }

      const snapshot = await authSessionService.bootstrap();
      if (snapshot.token?.trim()) {
        useAuthStore.getState().applyBootstrap(snapshot);
        await refreshAuthSessionIfNeeded({ force: true });
      }

      if (!cancelled) setRecovering(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [hydrated, recovering, token]);

  if (!hydrated || recovering) return <SplashFallback />;
  if (!token?.trim()) return <Navigate to={Routes.LOGIN} replace />;
  return <Outlet />;
}

export function GuestRoute() {
  const token = useAuthStore((s) => s.token);
  const hydrated = useAuthStore((s) => s.hydrated);
  const location = useLocation();
  if (!hydrated) return <SplashFallback />;
  /** Register + callback OAuth Google : ne pas couper le flux avant fin de persistance JWT. */
  if (
    token?.trim() &&
    location.pathname !== Routes.REGISTER &&
    location.pathname !== Routes.AUTH_EMAIL_CALLBACK
  ) {
    return <Navigate to={Routes.HOME} replace />;
  }
  return <Outlet />;
}

function SplashFallback() {
  return (
    <div style={{ minHeight: '100svh', display: 'grid', placeItems: 'center', background: '#fff' }}>
      <img src="/assets/icons/logo.png" alt="Quizz+" width={72} height={72} />
    </div>
  );
}
