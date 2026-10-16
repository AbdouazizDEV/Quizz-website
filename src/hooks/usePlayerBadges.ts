import { useCallback, useEffect, useState } from 'react';

import type { PlayerBadgeView } from '@constants/westAfricanBadges';
import { apiClient } from '@services/api/apiClient';
import { useAuthStore } from '@stores/authStore';

export function usePlayerBadges() {
  const token = useAuthStore((s) => s.token);
  const [badges, setBadges] = useState<PlayerBadgeView[]>([]);
  const [loading, setLoading] = useState(false);

  const refetch = useCallback(async () => {
    if (!token?.trim()) {
      setBadges([]);
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.get<{ badges: PlayerBadgeView[] }>('/progression/badges');
      setBadges(res.data.badges ?? []);
    } catch {
      setBadges([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { badges, loading, refetch };
}
