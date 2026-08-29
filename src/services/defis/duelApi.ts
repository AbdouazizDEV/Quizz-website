import { apiClient } from '@services/api/apiClient';
import {
  asRecord,
  authHeaders,
  readFiniteNumber,
  readString,
  unwrapItems,
  unwrapObject,
} from '@services/defis/nestDefisHelpers';
import {
  duelDetailCacheKey,
  pendingDuelsCacheKey,
  readWithOfflineCache,
  recentDuelsCacheKey,
} from '@services/offline';
import { useAuthMeStore } from '@stores/authMeStore';
import { extractApiError } from '@utils/extractApiError';

import type { DuelPhase, DuelSummary } from '@app-types/challenge.types';
import type { PaginatedResponse } from '@app-types/pagination.types';

function personName(row: Record<string, unknown>, prefix: 'challenger' | 'challenged'): string {
  const nested = asRecord(row[prefix]);
  return (
    readString(row[`${prefix}_name`]) ??
    readString(row[`${prefix}Name`]) ??
    readString(nested?.display_name) ??
    readString(nested?.username) ??
    readString(nested?.full_name) ??
    'Joueur'
  );
}

function personId(row: Record<string, unknown>, prefix: 'challenger' | 'challenged'): string {
  const nested = asRecord(row[prefix]);
  return (
    readString(row[`${prefix}_id`]) ??
    readString(row[`${prefix}Id`]) ??
    readString(nested?.id) ??
    ''
  );
}

function personAvatar(row: Record<string, unknown>, prefix: 'challenger' | 'challenged'): string | null {
  const nested = asRecord(row[prefix]);
  return (
    readString(row[`${prefix}_avatar_url`]) ??
    readString(row[`${prefix}AvatarUrl`]) ??
    readString(nested?.avatar_url) ??
    null
  );
}

const PHASES: DuelPhase[] = [
  'needs_your_acceptance',
  'waiting_opponent_acceptance',
  'your_turn',
  'waiting_opponent_play',
  'expired',
  'finished',
];

function derivePhase(row: Record<string, unknown>, viewerId: string | undefined): DuelPhase {
  const raw = readString(row.phase);
  if (raw && (PHASES as string[]).includes(raw)) return raw as DuelPhase;

  const status = readString(row.status);
  const expired = row.is_expired === true || status === 'expired';
  if (expired) return 'expired';
  if (status === 'completed' || status === 'declined') return 'finished';

  const challengerId = personId(row, 'challenger');
  const challengedId = personId(row, 'challenged');
  if (status === 'pending') {
    if (viewerId && challengedId === viewerId) return 'needs_your_acceptance';
    return 'waiting_opponent_acceptance';
  }
  if (status === 'accepted') {
    const myScore =
      viewerId === challengerId
        ? readFiniteNumber(row.challenger_score ?? row.challengerScore)
        : readFiniteNumber(row.challenged_score ?? row.challengedScore);
    return myScore == null ? 'your_turn' : 'waiting_opponent_play';
  }
  return 'finished';
}

function mapItem(row: Record<string, unknown>): DuelSummary {
  const viewerId = useAuthMeStore.getState().data?.user?.id;
  const statusRaw = readString(row.status) ?? 'pending';
  const status = (
    ['pending', 'accepted', 'declined', 'completed', 'expired'].includes(statusRaw)
      ? statusRaw
      : 'pending'
  ) as DuelSummary['status'];
  const phase = derivePhase(row, viewerId);
  return {
    id: readString(row.id) ?? '',
    challengerId: personId(row, 'challenger'),
    challengedId: personId(row, 'challenged'),
    challengerName: personName(row, 'challenger'),
    challengedName: personName(row, 'challenged'),
    challengerAvatarUrl: personAvatar(row, 'challenger'),
    challengedAvatarUrl: personAvatar(row, 'challenged'),
    challengerTotalScore:
      readFiniteNumber(row.challenger_total_score) ??
      readFiniteNumber(asRecord(row.challenger)?.total_score) ??
      0,
    challengedTotalScore:
      readFiniteNumber(row.challenged_total_score) ??
      readFiniteNumber(asRecord(row.challenged)?.total_score) ??
      0,
    challengerScore: readFiniteNumber(row.challenger_score) ?? null,
    challengedScore: readFiniteNumber(row.challenged_score) ?? null,
    status,
    winnerId: readString(row.winner_id) ?? readString(row.winnerId),
    expiresAt: readString(row.expires_at) ?? readString(row.expiresAt) ?? '',
    questionsCount: readFiniteNumber(row.questions_count) ?? readFiniteNumber(row.questionsCount) ?? 0,
    quizId: readString(row.quiz_id) ?? readString(row.quizId) ?? '',
    phase,
    isExpired: row.is_expired === true || phase === 'expired' || status === 'expired',
  };
}

function unwrapDuel(raw: unknown): Record<string, unknown> | null {
  const nested = unwrapObject(raw, ['item', 'duel', 'data']);
  if (!nested) return null;
  if (readString(nested.id) && (nested.challenger_id || nested.challenger || nested.challenged_id)) {
    return nested;
  }
  return asRecord(raw);
}

function mapPaginated(
  raw: unknown,
  fallbackLimit: number,
): PaginatedResponse<DuelSummary> {
  const record = asRecord(raw) ?? {};
  const mapped = unwrapItems(raw).map(mapItem).filter((item) => item.id);
  return {
    items: mapped,
    page: readFiniteNumber(record.page) ?? 1,
    limit: readFiniteNumber(record.limit) ?? fallbackLimit,
    total: readFiniteNumber(record.total) ?? mapped.length,
    hasMore: record.has_more === true || record.hasMore === true,
  };
}

async function fetchPendingDuelsOnline(params?: {
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<DuelSummary>> {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  const { data } = await apiClient.get('/defis/duels/pending', {
    headers: authHeaders(),
    params: { page, limit },
  });
  return mapPaginated(data, limit);
}

async function fetchRecentDuelsOnline(params?: {
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<DuelSummary>> {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  const { data } = await apiClient.get('/defis/duels/recent', {
    headers: authHeaders(),
    params: { page, limit },
  });
  return mapPaginated(data, limit);
}

async function fetchDuelByIdOnline(duelId: string): Promise<DuelSummary | null> {
  const { data } = await apiClient.get(`/defis/duels/${encodeURIComponent(duelId)}`, {
    headers: authHeaders(),
  });
  const item = unwrapDuel(data);
  return item ? mapItem(item) : null;
}

export async function apiFetchPendingDuels(params?: {
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<DuelSummary>> {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  return readWithOfflineCache({
    cacheKey: pendingDuelsCacheKey(page, limit),
    source: 'api',
    fetchOnline: () => fetchPendingDuelsOnline(params),
  });
}

export async function apiFetchRecentDuels(params?: {
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<DuelSummary>> {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  return readWithOfflineCache({
    cacheKey: recentDuelsCacheKey(page, limit),
    source: 'api',
    fetchOnline: () => fetchRecentDuelsOnline(params),
  });
}

export async function apiFetchDuelById(duelId: string): Promise<DuelSummary | null> {
  return readWithOfflineCache({
    cacheKey: duelDetailCacheKey(duelId),
    source: 'api',
    fetchOnline: () => fetchDuelByIdOnline(duelId),
  });
}

export async function apiCreateFriendDuel(challengedId: string): Promise<DuelSummary> {
  try {
    const { data } = await apiClient.post(
      '/defis/duels',
      { challenged_id: challengedId },
      { headers: authHeaders() },
    );
    const item = unwrapDuel(data);
    if (!item) throw new Error('Réponse serveur invalide.');
    return mapItem(item);
  } catch (error) {
    throw new Error(extractApiError(error, 'Impossible de créer le duel.'));
  }
}

export async function apiAcceptDuel(duelId: string): Promise<{ quizId: string }> {
  try {
    const { data } = await apiClient.post(
      `/defis/duels/${encodeURIComponent(duelId)}/accept`,
      {},
      { headers: authHeaders() },
    );
    const row = asRecord(data) ?? {};
    const quizId = readString(row.quiz_id) ?? readString(row.quizId);
    if (!quizId) throw new Error('Quiz du duel introuvable.');
    return { quizId };
  } catch (error) {
    throw new Error(extractApiError(error, "Impossible d'accepter le duel."));
  }
}

export async function apiDeclineDuel(duelId: string): Promise<void> {
  try {
    await apiClient.post(
      `/defis/duels/${encodeURIComponent(duelId)}/decline`,
      {},
      { headers: authHeaders() },
    );
  } catch (error) {
    throw new Error(extractApiError(error, 'Impossible de refuser le duel.'));
  }
}

export async function apiSubmitDuelScore(duelId: string, score: number): Promise<DuelSummary> {
  try {
    const { data } = await apiClient.post(
      `/defis/duels/${encodeURIComponent(duelId)}/score`,
      { score },
      { headers: authHeaders() },
    );
    const item = unwrapDuel(data);
    if (!item) throw new Error('Réponse serveur invalide.');
    return mapItem(item);
  } catch (error) {
    const message = extractApiError(error, '');
    if (message.includes('déjà joué') || message.includes('déjà terminé')) {
      const existing = await apiFetchDuelById(duelId);
      if (existing) return existing;
    }
    throw new Error(extractApiError(error, "Impossible d'enregistrer votre score de duel."));
  }
}
