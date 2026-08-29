import type {
  CompetitionBracket,
  CompetitionBracketMatch,
  CompetitionBracketRound,
  CompetitionSummary,
} from '@app-types/challenge.types';
import { apiClient } from '@services/api/apiClient';
import {
  asRecord,
  authHeaders,
  isConflict,
  throwIfNestRouteMissing,
  readFiniteNumber,
  readString,
  unwrapItems,
  unwrapObject,
} from '@services/defis/nestDefisHelpers';
import {
  applyOptimisticRegistration,
  validateRegistrationFromCache,
} from '@services/offline/competitionCacheOptimistic';
import {
  competitionBracketCacheKey,
  competitionDetailCacheKey,
  competitionsListCacheKey,
  enqueueApiMutation,
  fetchNetworkOnline,
  offlineStore,
  readWithOfflineCache,
} from '@services/offline';
import { extractApiError } from '@utils/extractApiError';

export interface CompetitionMutationResult {
  queued: boolean;
}

export type CompetitionTab = 'inscriptions' | 'en_cours' | 'fin';

function mapStatus(value: unknown): CompetitionSummary['status'] {
  const raw = readString(value)?.toLowerCase() ?? '';
  if (raw === 'scheduled' || raw === 'inscriptions' || raw === 'open') return 'scheduled';
  if (raw === 'live' || raw === 'en_cours' || raw === 'ongoing') return 'live';
  if (raw === 'completed' || raw === 'fin' || raw === 'termine' || raw === 'terminé') return 'completed';
  if (raw === 'cancelled' || raw === 'canceled') return 'cancelled';
  return 'draft';
}

function mapCompetition(row: Record<string, unknown>): CompetitionSummary {
  return {
    id: readString(row.id) ?? '',
    title: readString(row.title) ?? 'Tournoi',
    description: readString(row.description),
    categoryName: readString(row.category_name) ?? readString(row.categoryName),
    status: mapStatus(row.status),
    startsAt: readString(row.starts_at) ?? readString(row.startsAt),
    endsAt: readString(row.ends_at) ?? readString(row.endsAt),
    rewardText: readString(row.reward_text) ?? readString(row.rewardText),
    registeredCount: readFiniteNumber(row.registered_count) ?? readFiniteNumber(row.registered) ?? 0,
    maxParticipants: readFiniteNumber(row.max_participants) ?? 32,
    isRegistered: row.is_registered === true || row.isRegistered === true,
  };
}

async function loadCompetitionsByTab(tab: CompetitionTab): Promise<CompetitionSummary[]> {
  try {
    const { data } = await apiClient.get('/defis/competitions', {
      headers: authHeaders(),
      params: { tab },
    });
    return unwrapItems(data)
      .map(mapCompetition)
      .filter((item) => item.id);
  } catch (error) {
    throwIfNestRouteMissing(error, `GET /api/v1/defis/competitions?tab=${tab}`);
    throw new Error(extractApiError(error, 'Impossible de charger les tournois.'));
  }
}

async function loadCompetitionById(competitionId: string): Promise<CompetitionSummary | null> {
  try {
    const { data } = await apiClient.get(`/defis/competitions/${encodeURIComponent(competitionId)}`, {
      headers: authHeaders(),
    });
    const row = unwrapObject(data, ['competition', 'item', 'data']);
    return row ? mapCompetition(row) : null;
  } catch (error) {
    throwIfNestRouteMissing(error, `GET /api/v1/defis/competitions/${competitionId}`);
    throw new Error(extractApiError(error, 'Impossible de charger ce tournoi.'));
  }
}

function mapPlayer(raw: unknown): CompetitionBracketMatch['player1'] {
  const row = asRecord(raw);
  if (!row) return null;
  const id = readString(row.id) ?? readString(row.user_id);
  if (!id) return null;
  return {
    id,
    name: readString(row.display_name) ?? readString(row.name) ?? 'Joueur',
    score: readFiniteNumber(row.score) ?? null,
  };
}

function mapMatch(row: Record<string, unknown>, index: number, fallbackRound: number): CompetitionBracketMatch {
  return {
    id: readString(row.id) ?? `match-${fallbackRound}-${index}`,
    round: readFiniteNumber(row.round) ?? fallbackRound,
    player1: mapPlayer(row.player1 ?? row.player_1 ?? row.home),
    player2: mapPlayer(row.player2 ?? row.player_2 ?? row.away),
    winnerId: readString(row.winner_id) ?? readString(row.winnerId),
  };
}

function mapBracket(competitionId: string, raw: unknown): CompetitionBracket {
  const root = asRecord(raw) ?? {};
  const roundsRaw = Array.isArray(root.rounds) ? root.rounds : null;
  if (roundsRaw) {
    const rounds: CompetitionBracketRound[] = roundsRaw.map((item, index) => {
      const row = asRecord(item) ?? {};
      const roundNum = readFiniteNumber(row.round) ?? index + 1;
      const matches = unwrapItems(row.matches ?? item).map((match, matchIndex) =>
        mapMatch(match, matchIndex, roundNum),
      );
      return {
        round: roundNum,
        label: readString(row.label) ?? `Tour ${roundNum}`,
        matches,
      };
    });
    return { competitionId, rounds };
  }

  const matches = unwrapItems(root.matches ?? raw).map((match, index) => mapMatch(match, index, 1));
  const byRound = new Map<number, CompetitionBracketMatch[]>();
  for (const match of matches) {
    const list = byRound.get(match.round) ?? [];
    list.push(match);
    byRound.set(match.round, list);
  }
  const rounds = [...byRound.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([round, roundMatches]) => ({
      round,
      label: `Tour ${round}`,
      matches: roundMatches,
    }));
  return { competitionId, rounds };
}

async function loadBracket(competitionId: string): Promise<CompetitionBracket> {
  try {
    const { data } = await apiClient.get(
      `/defis/competitions/${encodeURIComponent(competitionId)}/bracket`,
      { headers: authHeaders() },
    );
    return mapBracket(competitionId, data);
  } catch (error) {
    throwIfNestRouteMissing(error, `GET /api/v1/defis/competitions/${competitionId}/bracket`);
    throw new Error(extractApiError(error, 'Impossible de charger le bracket.'));
  }
}

function registerPath(competitionId: string): string {
  return `/defis/competitions/${encodeURIComponent(competitionId)}/register`;
}

function unregisterPath(competitionId: string): string {
  return `/defis/competitions/${encodeURIComponent(competitionId)}/unregister`;
}

function fullError(error: unknown): boolean {
  const message = extractApiError(error, '').toLowerCase();
  return (
    isConflict(error) &&
    (message.includes('maximum') || message.includes('plein') || message.includes('complet') || message.includes('full'))
  );
}

export async function fetchCompetitionsByTab(
  tab: CompetitionTab,
  userId: string,
): Promise<CompetitionSummary[]> {
  return readWithOfflineCache({
    cacheKey: competitionsListCacheKey(tab, userId),
    source: 'api',
    fetchOnline: () => loadCompetitionsByTab(tab),
  });
}

export async function fetchCompetitionById(
  competitionId: string,
  userId: string,
): Promise<CompetitionSummary | null> {
  return readWithOfflineCache({
    cacheKey: competitionDetailCacheKey(competitionId, userId),
    source: 'api',
    fetchOnline: () => loadCompetitionById(competitionId),
  });
}

export async function fetchCompetitionBracket(competitionId: string): Promise<CompetitionBracket> {
  return readWithOfflineCache({
    cacheKey: competitionBracketCacheKey(competitionId),
    source: 'api',
    fetchOnline: () => loadBracket(competitionId),
  });
}

export async function registerForCompetition(
  userId: string,
  competitionId: string,
): Promise<CompetitionMutationResult> {
  const online = await fetchNetworkOnline();
  if (!online) {
    await validateRegistrationFromCache(userId, competitionId, true);
    const path = registerPath(competitionId);
    const alreadyQueued = await offlineStore.hasPendingMutation(path, {});
    if (alreadyQueued) throw new Error('Inscription déjà en attente de synchronisation.');
    await enqueueApiMutation({ method: 'POST', path, body: {} });
    await applyOptimisticRegistration(userId, competitionId, true);
    return { queued: true };
  }

  try {
    await apiClient.post(registerPath(competitionId), {}, { headers: authHeaders() });
    return { queued: false };
  } catch (error) {
    throwIfNestRouteMissing(error, `POST /api/v1/defis/competitions/${competitionId}/register`);
    if (fullError(error)) {
      throw new Error('Ce tournoi a atteint le nombre maximum de participants.');
    }
    throw new Error(extractApiError(error, "Impossible de s'inscrire à ce tournoi."));
  }
}

export async function unregisterFromCompetition(
  userId: string,
  competitionId: string,
): Promise<CompetitionMutationResult> {
  const online = await fetchNetworkOnline();
  if (!online) {
    await validateRegistrationFromCache(userId, competitionId, false);
    const path = unregisterPath(competitionId);
    const alreadyQueued = await offlineStore.hasPendingMutation(path, {});
    if (alreadyQueued) throw new Error('Désinscription déjà en attente de synchronisation.');
    await enqueueApiMutation({ method: 'POST', path, body: {} });
    await applyOptimisticRegistration(userId, competitionId, false);
    return { queued: true };
  }

  try {
    await apiClient.post(unregisterPath(competitionId), {}, { headers: authHeaders() });
    return { queued: false };
  } catch (error) {
    throwIfNestRouteMissing(error, `POST /api/v1/defis/competitions/${competitionId}/unregister`);
    throw new Error(extractApiError(error, 'Impossible de se désinscrire.'));
  }
}
