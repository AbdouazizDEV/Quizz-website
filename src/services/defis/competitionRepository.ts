import type {
  CompetitionBracket,
  CompetitionBracketMatch,
  CompetitionBracketPlayer,
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
  const p1 = mapPlayer(row.player1 ?? row.player_1 ?? row.home);
  const p2 = mapPlayer(row.player2 ?? row.player_2 ?? row.away);
  // Injecter scores du seed si présents
  const p1Score = readFiniteNumber(row.player1_score) ?? p1?.score ?? null;
  const p2Score = readFiniteNumber(row.player2_score) ?? p2?.score ?? null;
  return {
    id: readString(row.id) ?? `match-${fallbackRound}-${index}`,
    round: readFiniteNumber(row.round) ?? fallbackRound,
    player1: p1 ? { ...p1, score: p1Score } : null,
    player2: p2 ? { ...p2, score: p2Score } : null,
    winnerId: readString(row.winner_id) ?? readString(row.winnerId),
  };
}

function mapGroupStandings(groupRaw: unknown): CompetitionBracketPlayer[] {
  const group = asRecord(groupRaw);
  if (!group) return [];
  const scores = asRecord(group.scores) ?? {};
  const playersRaw = Array.isArray(group.players) ? group.players : [];
  const players = playersRaw
    .map((item) => mapPlayer(item))
    .filter((p): p is CompetitionBracketPlayer => Boolean(p))
    .map((p) => {
      const rawScore = scores[p.id];
      const score =
        typeof rawScore === 'number'
          ? rawScore
          : readFiniteNumber(rawScore) ?? p.score;
      return { ...p, score };
    });
  return players.sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
}

function mapBracket(competitionId: string, raw: unknown): CompetitionBracket {
  const root = asRecord(raw) ?? {};
  const roundsRaw = Array.isArray(root.rounds) ? root.rounds : null;
  if (roundsRaw) {
    const rounds: CompetitionBracketRound[] = roundsRaw.map((item, index) => {
      const row = asRecord(item) ?? {};
      const roundNum = readFiniteNumber(row.round) ?? index + 1;
      const mode = readString(row.mode) === 'group' ? 'group' : 'knockout';
      const standings = mode === 'group' ? mapGroupStandings(row.group) : undefined;
      let matches = unwrapItems(row.matches ?? item).map((match, matchIndex) =>
        mapMatch(match, matchIndex, roundNum),
      );
      // Afficher le classement groupe comme "matchs" mono-joueur si pas de matches
      if (mode === 'group' && matches.length === 0 && standings?.length) {
        matches = standings.map((player, i) => ({
          id: `standing-${roundNum}-${i}`,
          round: roundNum,
          player1: player,
          player2: null,
          winnerId: null,
        }));
      }
      return {
        round: roundNum,
        label: readString(row.label) ?? `Tour ${roundNum}`,
        matches,
        mode,
        standings,
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

export interface CompetitionMatchDrawResult {
  quizId: string;
  matchId: string;
  phase: string | null;
  difficultyLevel: string | null;
  questionsCount: number;
}

export async function drawCompetitionMatch(
  competitionId: string,
  matchId?: string,
): Promise<CompetitionMatchDrawResult> {
  try {
    const { data } = await apiClient.post(
      `/defis/competitions/${encodeURIComponent(competitionId)}/matches/draw`,
      matchId ? { match_id: matchId } : {},
      { headers: authHeaders() },
    );
    const root = asRecord(data) ?? {};
    const match = asRecord(root.match) ?? {};
    const quiz = asRecord(root.quiz) ?? {};
    const quizId = readString(quiz.id) ?? readString(match.quiz_id);
    const resolvedMatchId = readString(match.id);
    if (!quizId || !resolvedMatchId) {
      throw new Error('Tirage de match invalide.');
    }
    return {
      quizId,
      matchId: resolvedMatchId,
      phase: readString(match.phase),
      difficultyLevel: readString(match.difficulty_level) ?? readString(match.difficultyLevel),
      questionsCount:
        readFiniteNumber(quiz.questions_count) ??
        readFiniteNumber(quiz.total_questions) ??
        0,
    };
  } catch (error) {
    throwIfNestRouteMissing(
      error,
      `POST /api/v1/defis/competitions/${competitionId}/matches/draw`,
    );
    throw new Error(extractApiError(error, 'Impossible de démarrer le match.'));
  }
}

export interface CompetitionMatchScoreResult {
  waitingForOthers: boolean;
  tiebreak: boolean;
  advanced: boolean;
  status: string | null;
}

export async function submitCompetitionMatchScore(
  competitionId: string,
  input: { score: number; matchId?: string | null; quizId?: string | null },
): Promise<CompetitionMatchScoreResult> {
  try {
    const body: Record<string, unknown> = { score: input.score };
    if (input.matchId) body.match_id = input.matchId;
    if (input.quizId) body.quiz_id = input.quizId;
    const { data } = await apiClient.post(
      `/defis/competitions/${encodeURIComponent(competitionId)}/matches/score`,
      body,
      { headers: authHeaders() },
    );
    const root = asRecord(data) ?? {};
    return {
      waitingForOthers: root.waiting_for_others === true,
      tiebreak: root.tiebreak === true,
      advanced: root.advanced === true,
      status: readString(root.status),
    };
  } catch (error) {
    throwIfNestRouteMissing(
      error,
      `POST /api/v1/defis/competitions/${competitionId}/matches/score`,
    );
    throw new Error(extractApiError(error, 'Impossible d’enregistrer le score du match.'));
  }
}
