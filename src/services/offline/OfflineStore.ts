import type {
  CachedResponse,
  EnqueueMutationInput,
  QueuedMutation,
} from './types';
import {
  getOfflineDatabase,
  memoryCache,
  memoryQueue,
  persistOfflineQueue,
} from './offlineDatabase';

function createMutationId(): string {
  return `mq_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function mapQueuedRow(row: Record<string, unknown>): QueuedMutation {
  return {
    id: String(row.id),
    source: row.source as QueuedMutation['source'],
    method: row.method as QueuedMutation['method'],
    url: String(row.url),
    headersJson: row.headers_json != null ? String(row.headers_json) : null,
    bodyJson: row.body_json != null ? String(row.body_json) : null,
    createdAt: Number(row.created_at),
    status: row.status as QueuedMutation['status'],
    attempts: Number(row.attempts),
    lastError: row.last_error != null ? String(row.last_error) : null,
    sortOrder: Number(row.sort_order),
  };
}

/** Cache + file de mutations : localStorage (pas de SQLite côté web). */
export class OfflineStore {
  async init(): Promise<void> {
    await getOfflineDatabase();
  }

  async getCachedResponse<T>(cacheKey: string): Promise<T | null> {
    const raw = memoryCache.get(cacheKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async getCachedEntry(cacheKey: string): Promise<CachedResponse | null> {
    const raw = memoryCache.get(cacheKey);
    if (!raw) return null;
    return {
      cacheKey,
      source: 'api',
      method: 'GET',
      responseJson: raw,
      statusCode: 200,
      cachedAt: Date.now(),
    };
  }

  async removeCachedResponse(cacheKey: string): Promise<void> {
    memoryCache.delete(cacheKey);
  }

  async setCachedResponse(input: {
    cacheKey: string;
    source: CachedResponse['source'];
    method?: CachedResponse['method'];
    data: unknown;
    statusCode?: number;
  }): Promise<void> {
    memoryCache.set(input.cacheKey, JSON.stringify(input.data));
  }

  async enqueueMutation(input: EnqueueMutationInput): Promise<QueuedMutation> {
    const id = createMutationId();
    const createdAt = Date.now();
    const headersJson = input.headers ? JSON.stringify(input.headers) : null;
    const bodyJson = input.body !== undefined ? JSON.stringify(input.body) : null;
    const sortOrder = memoryQueue.length;
    const item = {
      id,
      source: input.source,
      method: input.method,
      url: input.url,
      headers_json: headersJson,
      body_json: bodyJson,
      created_at: createdAt,
      status: 'pending',
      attempts: 0,
      last_error: null,
      sort_order: sortOrder,
    };
    memoryQueue.push(item);
    persistOfflineQueue();
    return mapQueuedRow(item);
  }

  async listPendingMutations(): Promise<QueuedMutation[]> {
    return memoryQueue
      .filter((row) => row.status === 'pending' || row.status === 'failed')
      .sort((a, b) => Number(a.sort_order) - Number(b.sort_order))
      .map(mapQueuedRow);
  }

  async markMutationSyncing(id: string): Promise<void> {
    await this.updateMutationStatus(id, 'syncing');
  }

  async markMutationDone(id: string): Promise<void> {
    await this.updateMutationStatus(id, 'done');
  }

  async markMutationFailed(id: string, errorMessage: string): Promise<void> {
    const item = memoryQueue.find((row) => row.id === id);
    if (item) {
      item.status = 'failed';
      item.attempts = Number(item.attempts ?? 0) + 1;
      item.last_error = errorMessage;
      persistOfflineQueue();
    }
  }

  async countPendingMutations(): Promise<number> {
    const pending = await this.listPendingMutations();
    return pending.length;
  }

  async purgeDoneMutations(): Promise<void> {
    for (let i = memoryQueue.length - 1; i >= 0; i -= 1) {
      if (memoryQueue[i]?.status === 'done') memoryQueue.splice(i, 1);
    }
    persistOfflineQueue();
  }

  async hasPendingMutation(url: string, body: Record<string, string>): Promise<boolean> {
    const pending = await this.listPendingMutations();
    return pending.some((mutation) => {
      if (mutation.url !== url) return false;
      if (!mutation.bodyJson) return false;
      try {
        const parsed = JSON.parse(mutation.bodyJson) as Record<string, string>;
        return Object.entries(body).every(([key, value]) => parsed[key] === value);
      } catch {
        return false;
      }
    });
  }

  private async updateMutationStatus(id: string, status: QueuedMutation['status']): Promise<void> {
    const item = memoryQueue.find((row) => row.id === id);
    if (item) {
      item.status = status;
      persistOfflineQueue();
    }
  }
}

export const offlineStore = new OfflineStore();
