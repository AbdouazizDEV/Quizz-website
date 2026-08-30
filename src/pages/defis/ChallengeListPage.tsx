import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { ChallengeListCard } from '@components/ui/defis/ChallengeListCard';
import { DefisNavbar } from '@components/ui/defis/DefisNavbar';
import { DefisStateViews } from '@components/ui/defis/DefisStateViews';
import { DefisTabSwitcher } from '@components/ui/defis/DefisTabSwitcher';
import { DefisRoutes } from '@constants/defisRoutes';
import { fetchActiveWeeklyChallenges, fetchPastWeeklyChallenges } from '@services/defis/challengeRepository';

type Tab = 'active' | 'past';

export function ChallengeListPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('active');
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['weekly-challenges', tab],
    queryFn: () => (tab === 'active' ? fetchActiveWeeklyChallenges() : fetchPastWeeklyChallenges()),
  });

  const onBack = useCallback(() => navigate(DefisRoutes.hub), [navigate]);

  return (
    <div className="defis-page challenge-list-page">
      <DefisNavbar title="Challenge" onBack={onBack} />
      <DefisTabSwitcher
        tabs={[
          { id: 'active', label: 'En cours' },
          { id: 'past', label: 'Passés' },
        ]}
        value={tab}
        onChange={setTab}
      />
      {isLoading ? <DefisStateViews loading /> : null}
      {error ? (
        <DefisStateViews
          error={error instanceof Error ? error : 'Impossible de charger les challenges.'}
          onRetry={() => void refetch()}
        />
      ) : null}
      {!isLoading && !error ? (
        (data?.length ?? 0) === 0 ? (
          <DefisStateViews
            empty={tab === 'active' ? 'Aucun challenge actif.' : 'Aucun challenge passé.'}
          />
        ) : (
          <div className="defis-cards is-grid">
            {(data ?? []).map((item) => (
              <ChallengeListCard
                key={item.id}
                challenge={item}
                ctaLabel={tab === 'active' ? 'Participer' : 'Voir'}
                onPress={() => navigate(DefisRoutes.challengeDetail(item.id))}
              />
            ))}
          </div>
        )
      ) : null}
    </div>
  );
}
