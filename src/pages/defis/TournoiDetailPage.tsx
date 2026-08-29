import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { CompetitionHeroBanner } from '@components/ui/defis/CompetitionHeroBanner';
import { DefisNavbar } from '@components/ui/defis/DefisNavbar';
import { DefisStateViews } from '@components/ui/defis/DefisStateViews';
import { DefisRoutes } from '@constants/defisRoutes';
import { useAuthMe } from '@hooks/useAuthMe';
import { useAppError } from '@providers/AppErrorProvider';
import { notifyUser } from '@platform/notify';
import {
  fetchCompetitionById,
  registerForCompetition,
  unregisterFromCompetition,
} from '@services/defis/competitionRepository';
import { formatShortDate } from '@utils/defis/formatDefisTime';

export function TournoiDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: me } = useAuthMe();
  const { showAppError } = useAppError();
  const [busy, setBusy] = useState(false);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['competition', id, me?.user?.id],
    queryFn: () => fetchCompetitionById(id!, me!.user.id),
    enabled: Boolean(id && me?.user?.id),
  });

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ['competition', id] });
    await queryClient.invalidateQueries({ queryKey: ['competitions'] });
    await queryClient.invalidateQueries({ queryKey: ['defis-dashboard'] });
  };

  return (
    <div className="defis-page">
      <DefisNavbar title="Tournoi" onBack={() => navigate(DefisRoutes.tournoiList)} />
      {isLoading ? <DefisStateViews loading /> : null}
      {error ? (
        <DefisStateViews
          error={error instanceof Error ? error : 'Impossible de charger ce tournoi.'}
          onRetry={() => void refetch()}
        />
      ) : null}
      {data ? (
        <>
          <CompetitionHeroBanner competition={data} />
          {data.description ? <p>{data.description}</p> : null}
          <p className="defis-muted">
            {formatShortDate(data.startsAt)} → {formatShortDate(data.endsAt)}
          </p>
          <p className="defis-muted">{data.rewardText || 'Récompenses à gagner'}</p>
          {data.status === 'scheduled' ? (
            data.isRegistered ? (
              <button
                type="button"
                className="defis-cta defis-cta-ghost"
                disabled={busy}
                onClick={async () => {
                  if (!me?.user?.id) return;
                  setBusy(true);
                  try {
                    const result = await unregisterFromCompetition(me.user.id, data.id);
                    notifyUser(
                      'Tournoi',
                      result.queued
                        ? 'Désinscription enregistrée — synchronisation à la reconnexion.'
                        : 'Vous n’êtes plus inscrit.',
                    );
                    await invalidate();
                  } catch (err) {
                    showAppError(err instanceof Error ? err.message : 'Désinscription impossible.', {
                      title: 'Tournoi',
                    });
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                Se désinscrire
              </button>
            ) : (
              <button
                type="button"
                className="defis-cta defis-cta-primary"
                disabled={busy}
                onClick={async () => {
                  if (!me?.user?.id) return;
                  setBusy(true);
                  try {
                    const result = await registerForCompetition(me.user.id, data.id);
                    notifyUser(
                      'Tournoi',
                      result.queued
                        ? '✓ Inscription enregistrée — synchronisation à la reconnexion.'
                        : '✓ Vous êtes inscrit !',
                    );
                    await invalidate();
                  } catch (err) {
                    showAppError(err instanceof Error ? err.message : 'Inscription impossible.', {
                      title: 'Tournoi',
                    });
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                Inscrire
              </button>
            )
          ) : null}
          {id && (data.status === 'live' || data.status === 'completed') ? (
            <button
              type="button"
              className="defis-cta defis-cta-navy"
              onClick={() => navigate(DefisRoutes.tournoiBracket(id))}
            >
              Voir le bracket
            </button>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
