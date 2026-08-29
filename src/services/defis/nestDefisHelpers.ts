import axios from 'axios';

import { useAuthStore } from '@stores/authStore';

export const NEST_DEFIS_CONTRACT =
  'GET /api/v1/defis/dashboard, /defis/challenges, /defis/competitions, /defis/duels + Bearer JWT — voir README.';

/** Route Nest absente (backend pas encore branché). Ne pas masquer par un cache / mock. */
export class NestDefisRouteUnavailableError extends Error {
  readonly skipOfflineCache = true;
  constructor(public readonly route: string) {
    super(
      `Cette fonction n’est pas encore disponible côté serveur (${route}). Réessaie plus tard — le contrat JSON est dans le README.`,
    );
    this.name = 'NestDefisRouteUnavailableError';
  }
}

export function isNestDefisRouteUnavailable(error: unknown): error is NestDefisRouteUnavailableError {
  return error instanceof NestDefisRouteUnavailableError;
}

export function shouldSkipOfflineCache(error: unknown): boolean {
  return (
    (error instanceof Error && 'skipOfflineCache' in error && (error as { skipOfflineCache?: boolean }).skipOfflineCache === true) ||
    isNestDefisRouteUnavailable(error)
  );
}

export function authHeaders(): { Authorization: string } {
  const token = useAuthStore.getState().token?.trim();
  if (!token) throw new Error('Utilisateur non connecté. Reconnectez-vous.');
  return { Authorization: `Bearer ${token}` };
}

export function isNotFound(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 404;
}

export function isConflict(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 409;
}

export function isUnauthorized(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 401;
}

export function throwIfNestRouteMissing(error: unknown, route: string): never | void {
  if (isNotFound(error)) {
    throw new NestDefisRouteUnavailableError(route);
  }
}

export function contractError(detail: string): NestDefisRouteUnavailableError {
  return new NestDefisRouteUnavailableError(detail);
}

export function readFiniteNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

export function readString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

export function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

export function unwrapItems(raw: unknown): Record<string, unknown>[] {
  if (Array.isArray(raw)) {
    return raw.filter((row): row is Record<string, unknown> => Boolean(asRecord(row)));
  }
  const record = asRecord(raw);
  if (!record) return [];
  for (const key of ['items', 'challenges', 'competitions', 'duels', 'data', 'results', 'entries']) {
    const nested = record[key];
    if (Array.isArray(nested)) {
      return nested.filter((row): row is Record<string, unknown> => Boolean(asRecord(row)));
    }
  }
  return [];
}

export function unwrapObject(raw: unknown, nestedKeys: string[] = ['item', 'data']): Record<string, unknown> | null {
  const record = asRecord(raw);
  if (!record) return null;
  for (const key of nestedKeys) {
    const nested = asRecord(record[key]);
    if (nested) return nested;
  }
  return record;
}
