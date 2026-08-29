import type {
  ChallengeLeaderboard,
  ChallengeLeaderboardEntry,
  ChallengeProgress,
  DailyQuiz,
  WeeklyChallenge,
  WeeklyChallengeStatus,
} from '@app-types/challenge.types';
import { apiClient } from '@services/api/apiClient';
import {
  asRecord,
  authHeaders,
  throwIfNestRouteMissing,
  readFiniteNumber,
  readString,
  unwrapItems,
  unwrapObject,
} from '@services/defis/nestDefisHelpers';
import {
  activeWeeklyChallengesCacheKey,
  challengeLeaderboardCacheKey,
  challengeProgressCacheKey,
  pastWeeklyChallengesCacheKey,
  readWithOfflineCache,
} from '@services/offline';
import { extractApiError } from '@utils/extractApiError';
import { todayDateString } from '@utils/defis/formatDefisTime';

function mapStatus(value: unknown): WeeklyChallengeStatus {
  const raw = readString(value)?.toLowerCase() ?? '';
  if (raw === 'draft' || raw === 'brouillon') return 'draft';
  if (raw === 'termine' || raw === 'terminé' || raw === 'past' || raw === 'completed') return 'termine';
  return 'actif';
}

function mapChallenge(row: Record<string, unknown>): WeeklyChallenge {
  return {
    id: readString(row.id) ?? '',
    title: readString(row.title) ?? 'Challenge',
    description: readString(row.description),
    type: readString(row.type) ?? 'hebdomadaire',
    status: mapStatus(row.status),
    startsAt: readString(row.starts_at) ?? readString(row.startsAt) ?? '',
    endsAt: readString(row.ends_at) ?? readString(row.endsAt) ?? '',
    rewardText: readString(row.reward_text) ?? readString(row.rewardText),
  };
}

function mapDailyQuiz(row: Record<string, unknown>, index: number): DailyQuiz {
  const scheduledDay = readString(row.scheduled_day) ?? readString(row.scheduledDay) ?? '';
    const playedFlag = row.played === true || row.is_played === true;
    const notPlayed = row.played === false || row.is_played === false;
    const score = readFiniteNumber(row.score) ?? readFiniteNumber(row.user_score) ?? null;
    const today = todayDateString();
    const globallyCompleted = row.globally_completed === true;
    const isPlayed = playedFlag || (!notPlayed && score != null);
  return {
    quizId: readString(row.quiz_id) ?? readString(row.quizId) ?? '',
    title: readString(row.title) ?? 'Quiz',
    difficulty: readString(row.difficulty_label) ?? readString(row.difficulty) ?? 'Z1',
    scheduledDay,
    dayOrder: readFiniteNumber(row.day_order) ?? index + 1,
    userScore: score,
    maxScore: readFiniteNumber(row.max_score) ?? 10,
    isAvailable: Boolean(scheduledDay) && scheduledDay <= today && !isPlayed && !globallyCompleted,
    isPlayed,
    canReplay: false,
    globallyCompleted,
  };
}

async function loadChallenges(status: 'active' | 'past'): Promise<WeeklyChallenge[]> {
  try {
    const { data } = await apiClient.get('/defis/challenges', {
      headers: authHeaders(),
      params: { status },
    });
    return unwrapItems(data)
      .map(mapChallenge)
      .filter((item) => item.id);
  } catch (error) {
    throwIfNestRouteMissing(error, `GET /api/v1/defis/challenges?status=${status}`);
    throw new Error(extractApiError(error, 'Impossible de charger les challenges.'));
  }
}

async function loadChallengeProgress(challengeId: string): Promise<ChallengeProgress> {
  try {
    const { data } = await apiClient.get(`/defis/challenges/${encodeURIComponent(challengeId)}`, {
      headers: authHeaders(),
    });
    const root = asRecord(data) ?? {};
    const payload = asRecord(root.data) && asRecord(root.challenge) == null ? (asRecord(root.data) as Record<string, unknown>) : root;
    const challengeRow = asRecord(payload.challenge) ?? unwrapObject(data, ['challenge']) ?? payload;
    const quizzesRaw = Array.isArray(payload.daily_quizzes)
      ? payload.daily_quizzes
      : Array.isArray(payload.dailyQuizzes)
        ? payload.dailyQuizzes
        : [];
    const dailyQuizzes = (quizzesRaw as unknown[])
      .map((row, index) => mapDailyQuiz(asRecord(row) ?? {}, index))
      .filter((quiz) => quiz.quizId);

    const played = dailyQuizzes.filter((q) => q.isPlayed).length;
    return {
      challenge: mapChallenge(challengeRow),
      userScore: readFiniteNumber(payload.user_score) ?? 0,
      userRank: readFiniteNumber(payload.user_rank) ?? null,
      quizzesPlayed: readFiniteNumber(payload.quizzes_played) ?? played,
      totalQuizzes: readFiniteNumber(payload.total_quizzes) ?? dailyQuizzes.length,
      dailyQuizzes,
    };
  } catch (error) {
    throwIfNestRouteMissing(error, `GET /api/v1/defis/challenges/${challengeId}`);
    throw new Error(extractApiError(error, 'Impossible de charger ce challenge.'));
  }
}

function mapLeaderboardEntry(
  row: Record<string, unknown>,
  index: number,
  userId: string,
): ChallengeLeaderboardEntry {
  const uid = readString(row.user_id) ?? readString(row.id) ?? `player-${index}`;
  return {
    userId: uid,
    displayName: readString(row.display_name) ?? readString(row.username) ?? 'Joueur',
    totalScore: readFiniteNumber(row.score) ?? readFiniteNumber(row.total_score) ?? 0,
    rank: readFiniteNumber(row.rank) ?? index + 1,
    isCurrentUser: uid === userId || row.is_current_user === true,
  };
}

async function loadChallengeLeaderboard(
  challengeId: string,
  userId: string,
): Promise<ChallengeLeaderboard> {
  try {
    const { data } = await apiClient.get(
      `/defis/challenges/${encodeURIComponent(challengeId)}/leaderboard`,
      { headers: authHeaders() },
    );
    const root = asRecord(data) ?? {};
    const entries = unwrapItems(root.items ?? root.entries ?? data).map((row, index) =>
      mapLeaderboardEntry(row, index, userId),
    );
    const meRow = asRecord(root.me) ?? asRecord(root.current_user);
    const currentEntry = entries.find((e) => e.isCurrentUser) ?? null;
    let pointsToNextRank: number | null = readFiniteNumber(meRow?.points_to_next) ?? null;
    if (pointsToNextRank == null && currentEntry && currentEntry.rank > 1) {
      const above = entries.find((e) => e.rank === currentEntry.rank - 1);
      if (above) pointsToNextRank = Math.max(0, above.totalScore - currentEntry.totalScore + 1);
    }

    return {
      challengeTitle: readString(root.challenge_title) ?? readString(root.title) ?? 'Challenge',
      endsAt: readString(root.ends_at) ?? new Date().toISOString(),
      rewardText: readString(root.reward_text),
      currentUser: currentEntry
        ? {
            rank: currentEntry.rank,
            totalScore: currentEntry.totalScore,
            pointsToNextRank,
          }
        : meRow
          ? {
              rank: readFiniteNumber(meRow.rank) ?? 0,
              totalScore: readFiniteNumber(meRow.score) ?? readFiniteNumber(meRow.total_score) ?? 0,
              pointsToNextRank,
            }
          : null,
      entries,
    };
  } catch (error) {
    throwIfNestRouteMissing(error, `GET /api/v1/defis/challenges/${challengeId}/leaderboard`);
    throw new Error(extractApiError(error, 'Impossible de charger le classement.'));
  }
}

export async function fetchActiveWeeklyChallenges(): Promise<WeeklyChallenge[]> {
  return readWithOfflineCache({
    cacheKey: activeWeeklyChallengesCacheKey(),
    source: 'api',
    fetchOnline: () => loadChallenges('active'),
  });
}

export async function fetchPastWeeklyChallenges(): Promise<WeeklyChallenge[]> {
  return readWithOfflineCache({
    cacheKey: pastWeeklyChallengesCacheKey(),
    source: 'api',
    fetchOnline: () => loadChallenges('past'),
  });
}

export async function fetchChallengeProgress(
  challengeId: string,
  userId: string,
): Promise<ChallengeProgress> {
  return readWithOfflineCache({
    cacheKey: challengeProgressCacheKey(challengeId, userId),
    source: 'api',
    fetchOnline: () => loadChallengeProgress(challengeId),
  });
}

export async function fetchChallengeLeaderboard(
  challengeId: string,
  userId: string,
): Promise<ChallengeLeaderboard> {
  return readWithOfflineCache({
    cacheKey: challengeLeaderboardCacheKey(challengeId, userId),
    source: 'api',
    fetchOnline: () => loadChallengeLeaderboard(challengeId, userId),
  });
}
