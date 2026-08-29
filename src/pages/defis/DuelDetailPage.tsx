import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import { DefisNavbar } from '@components/ui/defis/DefisNavbar';
import { DefisStateViews } from '@components/ui/defis/DefisStateViews';
import { DuelMatchHero } from '@components/ui/defis/DuelMatchHero';
import { DefisRoutes } from '@constants/defisRoutes';
import { buildQuizEntryHref } from '@constants/Routes';
import { useAuthMe } from '@hooks/useAuthMe';
import { useDuelQuery } from '@hooks/defis/useDuelQuery';
import { useAppError } from '@providers/AppErrorProvider';
import { respondToDuel } from '@services/defis/duelRepository';
import { duelPhaseLabel } from '@utils/defis/duelLabels';

export function DuelDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useDuelQuery(id ?? '');
  const { data: me } = useAuthMe();
  const { showAppError } = useAppError();
  const [busy, setBusy] = useState(false);

  if (isLoading) {
    return (
      <div className="defis-page">
        <DefisNavbar title="Duel" onBack={() => navigate(DefisRoutes.duelHub)} />
        <DefisStateViews loading />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="defis-page">
        <DefisNavbar title="Duel" onBack={() => navigate(DefisRoutes.duelHub)} />
        <DefisStateViews
          error={error instanceof Error ? error : 'Duel introuvable.'}
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  return (
    <div className="defis-page">
      <DefisNavbar title="Duel" onBack={() => navigate(DefisRoutes.duelHub)} />
      <DuelMatchHero duel={data} />
      <p className="defis-muted">{duelPhaseLabel(data.phase)}</p>
      {data.phase === 'needs_your_acceptance' ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            className="defis-cta defis-cta-primary"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await respondToDuel(data.id, me?.user?.id ?? '', true);
                await queryClient.invalidateQueries({ queryKey: ['duel', data.id] });
                await queryClient.invalidateQueries({ queryKey: ['duels-pending'] });
              } catch (err) {
                showAppError(err instanceof Error ? err.message : "Impossible d'accepter.", {
                  title: 'Duel',
                });
              } finally {
                setBusy(false);
              }
            }}
          >
            Accepter
          </button>
          <button
            type="button"
            className="defis-cta defis-cta-ghost"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await respondToDuel(data.id, me?.user?.id ?? '', false);
                await queryClient.invalidateQueries({ queryKey: ['duels-pending'] });
                navigate(DefisRoutes.duelHub);
              } catch (err) {
                showAppError(err instanceof Error ? err.message : 'Impossible de refuser.', {
                  title: 'Duel',
                });
              } finally {
                setBusy(false);
              }
            }}
          >
            Refuser
          </button>
        </div>
      ) : null}
      {data.phase === 'your_turn' ? (
        <button
          type="button"
          className="defis-cta defis-cta-navy is-pulse"
          onClick={() => navigate(buildQuizEntryHref(data.quizId, { duelId: data.id }))}
        >
          Jouer
        </button>
      ) : null}
    </div>
  );
}
