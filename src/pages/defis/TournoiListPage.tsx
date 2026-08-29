import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { CompetitionListCard } from '@components/ui/defis/CompetitionListCard';
import { DefisNavbar } from '@components/ui/defis/DefisNavbar';
import { DefisStateViews } from '@components/ui/defis/DefisStateViews';
import { DefisTabSwitcher } from '@components/ui/defis/DefisTabSwitcher';
import { DefisRoutes } from '@constants/defisRoutes';
import { useAuthMe } from '@hooks/useAuthMe';
import {
  fetchCompetitionsByTab,
  type CompetitionTab,
} from '@services/defis/competitionRepository';

const TABS: Array<{ id: CompetitionTab; label: string }> = [
  { id: 'inscriptions', label: 'Inscriptions' },
  { id: 'en_cours', label: 'En cours' },
  { id: 'fin', label: 'Terminés' },
];

export function TournoiListPage() {
  const navigate = useNavigate();
  const { data: me } = useAuthMe();
  const [tab, setTab] = useState<CompetitionTab>('inscriptions');
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['competitions', tab, me?.user?.id],
    queryFn: () => fetchCompetitionsByTab(tab, me!.user.id),
    enabled: Boolean(me?.user?.id),
  });

  return (
    <div className="defis-page">
      <DefisNavbar title="Tournoi" onBack={() => navigate(DefisRoutes.hub)} />
      <section className="defis-arena defis-fade">
        <p style={{ margin: 0, fontSize: 22 }}>🏆</p>
        <h2>Arène des tournois</h2>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.78)', fontWeight: 600 }}>
          Affrontez la communauté · Brackets · Récompenses
        </p>
      </section>
      <DefisTabSwitcher tabs={TABS} value={tab} onChange={setTab} />
      {isLoading ? <DefisStateViews loading /> : null}
      {error ? (
        <DefisStateViews
          error={error instanceof Error ? error : 'Impossible de charger les tournois.'}
          onRetry={() => void refetch()}
        />
      ) : null}
      {!isLoading && !error && (data?.length ?? 0) === 0 ? (
        <DefisStateViews empty="Aucun tournoi dans cet onglet." />
      ) : (
        <div className="defis-cards is-grid">
          {(data ?? []).map((item) => (
            <CompetitionListCard
              key={item.id}
              competition={item}
              onPress={() => navigate(DefisRoutes.tournoiDetail(item.id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
