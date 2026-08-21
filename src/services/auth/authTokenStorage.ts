import { AUTH_STORAGE_KEYS } from '@constants/authStorageKeys';
import { webStorage } from '@platform/webStorage';

export async function readStoredRefreshToken(): Promise<string | null> {
  return webStorage.getItem(AUTH_STORAGE_KEYS.refreshToken);
}

export async function writeStoredRefreshToken(refreshToken: string): Promise<void> {
  await webStorage.setItem(AUTH_STORAGE_KEYS.refreshToken, refreshToken);
}

export async function clearStoredRefreshToken(): Promise<void> {
  await webStorage.removeItem(AUTH_STORAGE_KEYS.refreshToken);
}

export async function readStoredSessionExpiresAt(): Promise<number | null> {
  const raw = await webStorage.getItem(AUTH_STORAGE_KEYS.sessionExpiresAt);
  if (!raw) return null;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : null;
}

export async function writeStoredSessionExpiresAt(expiresAt: number): Promise<void> {
  await webStorage.setItem(AUTH_STORAGE_KEYS.sessionExpiresAt, String(expiresAt));
}

export async function clearStoredSessionExpiresAt(): Promise<void> {
  await webStorage.removeItem(AUTH_STORAGE_KEYS.sessionExpiresAt);
}
