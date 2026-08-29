import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@stores/authStore';

import type { DefisDashboardData } from '@app-types/defisDashboard.types';
import { fetchDefisDashboard } from '@services/defis/defisDashboardRepository';

export function useDefisDashboard(userId: string | undefined) {
  const token = useAuthStore((s) => s.token);
  return useQuery<DefisDashboardData>({
    queryKey: ['defis-dashboard', userId],
    queryFn: () => fetchDefisDashboard(userId),
    enabled: Boolean(token?.trim()),
    staleTime: 1000 * 60,
  });
}
