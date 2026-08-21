const CACHE_STORAGE_KEY = 'quizz.offline.cache.v1';
const QUEUE_STORAGE_KEY = 'quizz.offline.queue.v1';

const cacheMap = new Map<string, string>();
export const memoryQueue: Array<Record<string, unknown>> = [];

function persist(): void {
  try {
    localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify([...cacheMap.entries()]));
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(memoryQueue));
  } catch {
    /* quota */
  }
}

export const memoryCache = {
  get(key: string) {
    return cacheMap.get(key);
  },
  set(key: string, value: string) {
    cacheMap.set(key, value);
    persist();
    return this;
  },
  delete(key: string) {
    const result = cacheMap.delete(key);
    persist();
    return result;
  },
  clear() {
    cacheMap.clear();
    persist();
  },
};

function hydrate(): void {
  try {
    const storedCache = localStorage.getItem(CACHE_STORAGE_KEY);
    if (storedCache) {
      const entries = JSON.parse(storedCache) as [string, string][];
      cacheMap.clear();
      for (const [key, value] of entries) cacheMap.set(key, value);
    }
    const storedQueue = localStorage.getItem(QUEUE_STORAGE_KEY);
    if (storedQueue) {
      const items = JSON.parse(storedQueue) as Array<Record<string, unknown>>;
      memoryQueue.splice(0, memoryQueue.length, ...items);
    }
  } catch {
    /* ignore */
  }
}

hydrate();

if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', persist);
  window.addEventListener('beforeunload', persist);
}

export function isUsingMemoryFallback(): boolean {
  return true;
}

export function enableMemoryFallback(_error?: unknown): void {
  /* IndexedDB/SQLite non utilisés côté web : cache localStorage. */
}

export async function getOfflineDatabase(): Promise<null> {
  persist();
  return null;
}

export async function ensureOfflineDatabaseReady(): Promise<void> {
  persist();
}

export function persistOfflineQueue(): void {
  persist();
}
