import { useCallback, useEffect, useState } from 'react';

import { fetchGlobalLeaderboard } from '@services/leaderboard/fetchGlobalLeaderboard';
import { useAuthStore } from '@stores/authStore';

export interface HomeLeaderboardRow {
  id: string;
  displayName: string;
  points: number;
  avatar?: string;
}

interface Result {
  data: HomeLeaderboardRow[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useHomeLeaderboard(limit = 5): Result {
  const token = useAuthStore((s) => s.token);
  const [data, setData] = useState<HomeLeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = await fetchGlobalLeaderboard(limit, token);
      const mapped = payload.items.map((r) => ({
        id: r.id,
        displayName: r.displayName,
        points: r.score,
        avatar: r.avatarUrl,
      }));
      setData(mapped);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [limit, token]);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
