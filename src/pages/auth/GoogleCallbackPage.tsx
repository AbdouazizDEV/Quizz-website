import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Routes } from '@constants/Routes';
import { persistPasskeyAuthResult, signOutAndSyncStore } from '@services/auth/authSessionController';
import { clearAuthMeCache, loadAuthMe } from '@services/auth/authMeRepository';
import { authSessionService } from '@services/auth/authSessionServiceInstance';
import { useAuthStore } from '@stores/authStore';
import type { AuthSessionPayload } from '@app-types/authSession.types';

function readSessionFromHash(): AuthSessionPayload | null {
  const raw = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash;
  if (!raw.trim()) return null;
  const params = new URLSearchParams(raw);
  const access_token = params.get('access_token')?.trim();
  const refresh_token = params.get('refresh_token')?.trim();
  if (!access_token || !refresh_token) return null;
  const expires_in = Number(params.get('expires_in') ?? '0');
  const expires_atRaw = params.get('expires_at');
  const expires_at = expires_atRaw ? Number(expires_atRaw) : undefined;
  return {
    access_token,
    refresh_token,
    expires_in: Number.isFinite(expires_in) ? expires_in : 0,
    expires_at: expires_at != null && Number.isFinite(expires_at) ? expires_at : undefined,
    token_type: params.get('token_type')?.trim() || 'bearer',
  };
}

export function GoogleCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const session = readSessionFromHash();
    if (!session) {
      setError('Connexion Google incomplète.');
      return;
    }

    void (async () => {
      try {
        // Efface une session expirée avant d’appliquer les jetons OAuth (évite une déconnexion immédiate).
        await authSessionService.signOut();
        useAuthStore.getState().clearSession();
        await clearAuthMeCache();

        await persistPasskeyAuthResult(session);
        const me = await loadAuthMe({ force: true });
        if (!me?.user) {
          await signOutAndSyncStore();
          throw new Error('Profil introuvable après connexion Google.');
        }
        window.history.replaceState(null, '', Routes.AUTH_EMAIL_CALLBACK);
        navigate(Routes.HOME, { replace: true });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Connexion Google impossible.');
      }
    })();
  }, [navigate]);

  if (error) {
    return (
      <main className="auth-root" style={{ justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <p className="auth-error">{error}</p>
        <button type="button" className="auth-btn auth-btn-primary" onClick={() => navigate(Routes.LOGIN)}>
          Retour connexion
        </button>
      </main>
    );
  }

  return (
    <main className="auth-root" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div className="auth-loader" aria-label="Connexion Google en cours" />
    </main>
  );
}
