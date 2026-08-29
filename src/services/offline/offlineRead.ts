import { ensureOfflineDatabaseReady } from './offlineDatabase';
import { fetchNetworkOnline } from './networkStatus';
import { offlineStore } from './OfflineStore';
import type { OfflineSource } from './types';

export class OfflineCacheMissError extends Error {
  constructor(
    message = 'Données indisponibles hors ligne. Ouvrez cette page une fois en ligne pour les mettre en cache.',
  ) {
    super(message);
    this.name = 'OfflineCacheMissError';
  }
}

export function isOfflineCacheMissError(error: unknown): error is OfflineCacheMissError {
  return error instanceof OfflineCacheMissError;
}

function skipCacheFallback(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === 'object' &&
      'skipOfflineCache' in error &&
      (error as { skipOfflineCache?: boolean }).skipOfflineCache === true,
  );
}

interface ReadWithOfflineCacheOptions<T> {
  cacheKey: string;
  source: OfflineSource;
  fetchOnline: () => Promise<T>;
  fallbackToCacheOnError?: boolean;
}

/**
 * En ligne : fetch réseau puis mise en cache.
 * Hors ligne (ou échec réseau) : retourne le cache local si disponible.
 * Les 404 de routes Nest non implémentées (`skipOfflineCache`) ne sont jamais masquées.
 */
export async function readWithOfflineCache<T>({
  cacheKey,
  source,
  fetchOnline,
  fallbackToCacheOnError = true,
}: ReadWithOfflineCacheOptions<T>): Promise<T> {
  await ensureOfflineDatabaseReady();
  const online = await fetchNetworkOnline();

  if (online) {
    try {
      const data = await fetchOnline();
      try {
        await offlineStore.setCachedResponse({ cacheKey, source, data });
      } catch {
        // Ne pas bloquer l'écran si l'écriture cache échoue.
      }
      return data;
    } catch (error) {
      if (skipCacheFallback(error) || !fallbackToCacheOnError) throw error;
      const cached = await offlineStore.getCachedResponse<T>(cacheKey);
      if (cached !== null) return cached;
      throw error;
    }
  }

  const cached = await offlineStore.getCachedResponse<T>(cacheKey);
  if (cached !== null) return cached;

  throw new OfflineCacheMissError();
}
