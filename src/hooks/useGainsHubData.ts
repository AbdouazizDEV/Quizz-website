import { useCallback, useEffect, useState } from 'react';

import type { GainsHubData } from '@app-types/gains.types';
import { loadAuthMe } from '@services/auth/authMeRepository';
import { fetchGlobalLeaderboard } from '@services/leaderboard/fetchGlobalLeaderboard';
import { mapToGainsHubData } from '@services/gains/mapToGainsHubData';
import { useAuthStore } from '@stores/authStore';

interface Result {
  data: GainsHubData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useGainsHubData(): Result {
  const token = useAuthStore((s) => s.token);
  const [data, setData] = useState<GainsHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const me = await loadAuthMe({ force: true });
      const board = await fetchGlobalLeaderboard(10, token);
      const myRank =
        board.me?.rank ?? board.items.find((item) => item.id === me?.user?.id)?.rank ?? null;
      setData(
        mapToGainsHubData({
          me,
          leaderboard: board.items,
          myRank,
        }),
      );
    } catch (e) {
      setData(null);
      setError(e instanceof Error ? e : new Error('Impossible de charger tes gains.'));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
