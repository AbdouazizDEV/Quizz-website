import { useAuthStore } from '@stores/authStore';

import { readStoredRefreshToken, readStoredSessionExpiresAt } from './authTokenStorage';
import { authSessionService } from './authSessionServiceInstance';
import { refreshPasskeySession } from './passkeyAuthService';

export type RefreshAuthResult =
  | { ok: true; accessToken: string }
  | {
      ok: false;
      reason: 'no_refresh_token' | 'not_logged_in' | 'refresh_failed';
      message?: string;
    };

/** Marge avant expiration pour anticiper le refresh (évite les 401 en plein quiz). */
const EXPIRY_SKEW_SECONDS = 120;

function decodeJwtExp(token: string): number | null {
  try {
    const segment = token.split('.')[1];
    if (!segment || typeof globalThis.atob !== 'function') return null;
    const normalized = segment.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
    const json = globalThis.atob(padded);
    const payload = JSON.parse(json) as { exp?: number };
    return typeof payload.exp === 'number' ? payload.exp : null;
  } catch {
    return null;
  }
}

export function isAccessTokenLikelyExpired(token: string, storedExpiresAt?: number | null): boolean {
  const exp = storedExpiresAt ?? decodeJwtExp(token);
  if (!exp) return false;
  return Date.now() / 1000 >= exp - EXPIRY_SKEW_SECONDS;
}

/**
 * Rafraîchit le JWT via POST /auth/passkey/refresh, puis met à jour SecureStore + Zustand.
 */
export async function refreshAuthSessionIfNeeded(options?: {
  force?: boolean;
}): Promise<RefreshAuthResult> {
  const accessToken = useAuthStore.getState().token?.trim();
  const refreshToken = (await readStoredRefreshToken())?.trim();
  if (!refreshToken) return { ok: false, reason: 'no_refresh_token' };
  if (!accessToken) return { ok: false, reason: 'not_logged_in' };

  const storedExpiresAt = await readStoredSessionExpiresAt();
  if (!options?.force && !isAccessTokenLikelyExpired(accessToken, storedExpiresAt)) {
    return { ok: true, accessToken };
  }

  try {
    const session = await refreshPasskeySession(refreshToken);
    if (!session.access_token?.trim()) {
      return { ok: false, reason: 'refresh_failed', message: 'Session absente après refresh.' };
    }

    await authSessionService.saveAuthenticatedSession(
      session.access_token,
      session.refresh_token ?? refreshToken,
      session,
    );
    useAuthStore.getState().setToken(session.access_token);
    return { ok: true, accessToken: session.access_token };
  } catch (error) {
    return {
      ok: false,
      reason: 'refresh_failed',
      message: error instanceof Error ? error.message : 'Refresh session impossible.',
    };
  }
}
