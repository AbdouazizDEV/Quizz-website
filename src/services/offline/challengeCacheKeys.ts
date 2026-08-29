import { buildCacheKey } from './cacheKey';

export function activeWeeklyChallengesCacheKey(): string {
  return buildCacheKey({
    source: 'api',
    method: 'GET',
    path: 'defis/challenges/active',
  });
}

export function pastWeeklyChallengesCacheKey(): string {
  return buildCacheKey({
    source: 'api',
    method: 'GET',
    path: 'defis/challenges/past',
  });
}

export function challengeProgressCacheKey(challengeId: string, userId: string): string {
  return buildCacheKey({
    source: 'api',
    method: 'GET',
    path: 'defis/challenges/progress',
    params: { challengeId, userId },
  });
}

export function challengeLeaderboardCacheKey(challengeId: string, userId: string): string {
  return buildCacheKey({
    source: 'api',
    method: 'GET',
    path: 'defis/challenges/leaderboard',
    params: { challengeId, userId },
  });
}
