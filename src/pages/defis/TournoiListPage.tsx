import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { DefisNavbar } from '@components/ui/defis/DefisNavbar';
import { DefisTabSwitcher } from '@components/ui/defis/DefisTabSwitcher';
import { TournoiCard } from '@components/ui/defis/TournoiCard';
import { DefisRoutes } from '@constants/defisRoutes';
import { useAuthMe } from '@hooks/useAuthMe';
import { useNetworkStatus } from '@hooks/useNetworkStatus';
import { useAppError } from '@providers/AppErrorProvider';
import {
  fetchCompetitionsByTab,
  registerForCompetition,
  type CompetitionTab,
} from '@services/defis/competitionRepository';
import type { CompetitionSummary } from '@app-types/challenge.types';

const TABS: Array<{ id: CompetitionTab; label: string }> = [
  { id: 'inscriptions', label: 'Inscriptions' },
  { id: 'en_cours', label: 'En cours' },
  { id: 'fin', label: 'Terminés' },
];

export function TournoiListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { showAppError } = useAppError();
  const { data: me } = useAuthMe();
  const userId = me?.user?.id ?? '';
  const { isOnline } = useNetworkStatus();
  const [tab, setTab] = useState<CompetitionTab>('inscriptions');
  const [registeringId, setRegisteringId] = useState<string | null>(null);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['competitions', tab, userId],
    queryFn: () => fetchCompetitionsByTab(tab, userId),
    enabled: Boolean(userId),
  });

  useEffect(() => {
    if (!userId) return;
    void refetch();
  }, [location.pathname, refetch, tab, userId]);

  const onRegister = async (competition: CompetitionSummary) => {
    if (!userId || registeringId) return;
    if (competition.registeredCount >= competition.maxParticipants) {
      showAppError('Ce tournoi a atteint le nombre maximum de participants.', {
        title: 'Tournoi complet',
      });
      return;
    }
    setRegisteringId(competition.id);
    try {
      const result = await registerForCompetition(userId, competition.id);
      await queryClient.invalidateQueries({ queryKey: ['competitions'] });
      window.alert(
        result.queued
          ? '✓ Inscription enregistrée — synchronisation à la reconnexion.'
          : '✓ Vous êtes inscrit !',
      );
    } catch (err) {
      showAppError(err instanceof Error ? err.message : 'Inscription impossible.', {
        title: 'Tournoi',
      });
    } finally {
      setRegisteringId(null);
    }
  };

  return (
    <div className="defis-page defis-page--shell tournoi-list-page">
      <DefisNavbar title="Tournois" onBack={() => navigate(DefisRoutes.hub)} />

      <section className="defis-arena tournoi-arena defis-fade" aria-label="Arène des tournois">
        <p className="tournoi-arena-emoji">🏆</p>
        <h2 className="tournoi-arena-title">Arène des tournois</h2>
        <p className="tournoi-arena-sub">Affrontez la communauté · Brackets · Récompenses</p>
      </section>

      <DefisTabSwitcher tabs={TABS} value={tab} onChange={setTab} />

      {isLoading ? (
        <div className="tournoi-list-loader" role="status" aria-label="Chargement">
          <div className="defis-spinner is-primary" />
        </div>
      ) : null}

      {!isOnline && (data?.length ?? 0) > 0 ? (
        <p className="tournoi-offline-hint">
          Données en cache — reconnectez-vous pour actualiser.
        </p>
      ) : null}

      {!isLoading && !isError && (data?.length ?? 0) > 0 ? (
        <div className="tournoi-list">
          {(data ?? []).map((competition, index) => (
            <TournoiCard
              key={competition.id}
              competition={competition}
              index={index}
              registering={registeringId === competition.id}
              onPress={() => navigate(DefisRoutes.tournoiDetail(competition.id))}
              onRegister={() => void onRegister(competition)}
            />
          ))}
        </div>
      ) : null}

      {!isLoading && isError ? (
        <p className="tournoi-list-empty">
          {error instanceof Error ? error.message : 'Impossible de charger les tournois.'}
        </p>
      ) : null}

      {!isLoading && !isError && (data?.length ?? 0) === 0 ? (
        <p className="tournoi-list-empty">Aucun tournoi dans cette catégorie.</p>
      ) : null}
    </div>
  );
}
