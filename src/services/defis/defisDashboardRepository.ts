import axios from 'axios';

import type { DefisDashboardData } from '@app-types/defisDashboard.types';
import { apiClient } from '@services/api/apiClient';
import { fetchActiveWeeklyChallenges } from '@services/defis/challengeRepository';
import { fetchCompetitionsByTab } from '@services/defis/competitionRepository';
import { fetchPendingDuelsForUser } from '@services/defis/duelRepository';
import {
  asRecord,
  authHeaders,
  isNestDefisRouteUnavailable,
  isNotFound,
  NestDefisRouteUnavailableError,
  readFiniteNumber,
  readString,
} from '@services/defis/nestDefisHelpers';

function emptyStats(): DefisDashboardData['userStats'] {
  return { defiPlayed: 0, bestRank: null, duelsWon: 0, duelsTotal: 0 };
}

function mapDashboard(raw: unknown): DefisDashboardData {
  const row = asRecord(raw) ?? {};
  const challenge = asRecord(row.current_week_challenge);
  const stats = asRecord(row.user_stats);
  const challengeId = readString(challenge?.id);
  const bestRank = readFiniteNumber(stats?.best_rank);
  return {
    activeChallengeCount: readFiniteNumber(row.active_challenge_count) ?? 0,
    activeTournamentCount: readFiniteNumber(row.active_tournament_count) ?? 0,
    pendingDuelCount: readFiniteNumber(row.pending_duel_count) ?? 0,
    currentWeekChallenge: challengeId
      ? {
          id: challengeId,
          title: readString(challenge?.title) ?? 'Challenge de la semaine',
          endsAt: readString(challenge?.ends_at) ?? readString(challenge?.endsAt) ?? '',
        }
      : null,
    userStats: {
      defiPlayed: readFiniteNumber(stats?.defi_played) ?? 0,
      bestRank: bestRank && bestRank > 0 ? bestRank : null,
      duelsWon: readFiniteNumber(stats?.duels_won) ?? 0,
      duelsTotal: readFiniteNumber(stats?.duels_total) ?? 0,
    },
  };
}

async function tryDerive<T>(load: () => Promise<T>): Promise<{ ok: boolean; missing: boolean; data: T | null }> {
  try {
    return { ok: true, missing: false, data: await load() };
  } catch (error) {
    if (isNotFound(error) || isNestDefisRouteUnavailable(error)) {
      return { ok: false, missing: true, data: null };
    }
    throw error;
  }
}

/** Fallback uniquement si GET /defis/dashboard est en 404. */
async function composeDashboardFromLists(userId: string): Promise<DefisDashboardData> {
  const [challenges, tournaments, duels] = await Promise.all([
    tryDerive(() => fetchActiveWeeklyChallenges()),
    tryDerive(() => fetchCompetitionsByTab('en_cours', userId)),
    tryDerive(() => fetchPendingDuelsForUser(userId, { page: 1, limit: 1 })),
  ]);

  if (challenges.missing && tournaments.missing && duels.missing) {
    throw new NestDefisRouteUnavailableError(
      'GET /api/v1/defis/dashboard (et lists challenges / competitions / duels aussi en 404)',
    );
  }

  const challengeList = challenges.data ?? [];
  const featured = challengeList[0];
  const duelPage = duels.data;

  return {
    activeChallengeCount: challengeList.length,
    activeTournamentCount: (tournaments.data ?? []).length,
    pendingDuelCount: duelPage?.total ?? duelPage?.items.length ?? 0,
    currentWeekChallenge: featured
      ? { id: featured.id, title: featured.title, endsAt: featured.endsAt }
      : null,
    userStats: emptyStats(),
  };
}

export async function fetchDefisDashboard(userId?: string): Promise<DefisDashboardData> {
  try {
    const { data } = await apiClient.get('/defis/dashboard', { headers: authHeaders() });
    return mapDashboard(data);
  } catch (error) {
    if (!isNotFound(error) && !isNestDefisRouteUnavailable(error)) {
      if (axios.isAxiosError(error) && !error.response) {
        throw new Error('Réseau indisponible. Réessaie dans un instant.');
      }
      throw error instanceof Error ? error : new NestDefisRouteUnavailableError('GET /api/v1/defis/dashboard');
    }

    return composeDashboardFromLists(userId?.trim() ?? '');
  }
}
