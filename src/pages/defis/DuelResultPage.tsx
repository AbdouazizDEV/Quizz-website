import { useNavigate, useParams } from 'react-router-dom';

import { DefisNavbar } from '@components/ui/defis/DefisNavbar';
import { DefisStateViews } from '@components/ui/defis/DefisStateViews';
import { DuelMatchHero } from '@components/ui/defis/DuelMatchHero';
import { DefisRoutes } from '@constants/defisRoutes';
import { useAuthMe } from '@hooks/useAuthMe';
import { useDuelQuery } from '@hooks/defis/useDuelQuery';
import { createFriendDuel } from '@services/defis/duelRepository';
import { resolveDuelOutcome } from '@utils/defis/resolveDuelOutcome';
import { useAppError } from '@providers/AppErrorProvider';

export function DuelResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useDuelQuery(id ?? '');
  const { data: me } = useAuthMe();
  const { showAppError } = useAppError();
  const userId = me?.user?.id ?? '';
  const outcome = data && userId ? resolveDuelOutcome(data, userId) : null;
  const opponentId = data
    ? data.challengerId === userId
      ? data.challengedId
      : data.challengerId
    : null;

  return (
    <div className="defis-page">
      <DefisNavbar title="Résultat" onBack={() => navigate(DefisRoutes.duelHub)} />
      {isLoading ? <DefisStateViews loading /> : null}
      {error ? <DefisStateViews error={error instanceof Error ? error : 'Duel introuvable.'} /> : null}
      {data ? (
        <>
          <DuelMatchHero duel={data} />
          <section className="defis-card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 28, margin: 0 }}>{outcome?.icon}</p>
            <h2 className="defis-card-title">{outcome?.label ?? 'Résultat'}</h2>
            <p className="defis-muted">{outcome?.points}</p>
          </section>
          {opponentId ? (
            <button
              type="button"
              className="defis-cta defis-cta-primary"
              onClick={async () => {
                try {
                  const result = await createFriendDuel(userId, opponentId);
                  if (result.data?.id) navigate(DefisRoutes.duelDetail(result.data.id));
                } catch (err) {
                  showAppError(err instanceof Error ? err.message : 'Impossible de relancer un duel.', {
                    title: 'Duel',
                  });
                }
              }}
            >
              Revanche
            </button>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
