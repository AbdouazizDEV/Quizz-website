import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { DefisNavbar } from '@components/ui/defis/DefisNavbar';
import { DefisStateViews } from '@components/ui/defis/DefisStateViews';
import { DuelListCard } from '@components/ui/defis/DuelListCard';
import { DefisRoutes } from '@constants/defisRoutes';
import { useAuthMe } from '@hooks/useAuthMe';
import { fetchPendingDuelsForUser } from '@services/defis/duelRepository';
import { openDuelFromList } from '@utils/defis/openDuelFromList';

export function DuelPendingPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: me } = useAuthMe();
  const userId = me?.user?.id ?? '';
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['duels-pending-list', userId],
    queryFn: () => fetchPendingDuelsForUser(userId, { page: 1, limit: 30 }),
    enabled: Boolean(userId),
  });

  return (
    <div className="defis-page">
      <DefisNavbar title="En attente" onBack={() => navigate(DefisRoutes.duelHub)} />
      {isLoading ? <DefisStateViews loading /> : null}
      {error ? (
        <DefisStateViews
          error={error instanceof Error ? error : 'Impossible de charger les duels.'}
          onRetry={() => void refetch()}
        />
      ) : null}
      {!isLoading && (data?.items.length ?? 0) === 0 ? (
        <DefisStateViews empty="Aucun duel en attente." />
      ) : (
        <div className="defis-cards is-grid">
          {(data?.items ?? []).map((duel) => (
            <DuelListCard
              key={duel.id}
              duel={duel}
              userId={userId}
              onPress={() => openDuelFromList(navigate, queryClient, duel)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
