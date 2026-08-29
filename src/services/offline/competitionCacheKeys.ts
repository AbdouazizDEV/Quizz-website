import { buildCacheKey } from './cacheKey';

export function competitionsListCacheKey(tab: string, userId: string): string {
  return buildCacheKey({
    source: 'api',
    method: 'GET',
    path: 'defis/competitions/list',
    params: { tab, userId },
  });
}

export function competitionDetailCacheKey(competitionId: string, userId: string): string {
  return buildCacheKey({
    source: 'api',
    method: 'GET',
    path: 'defis/competitions/detail',
    params: { competitionId, userId },
  });
}

export function competitionBracketCacheKey(competitionId: string): string {
  return buildCacheKey({
    source: 'api',
    method: 'GET',
    path: 'defis/competitions/bracket',
    params: { competitionId },
  });
}
