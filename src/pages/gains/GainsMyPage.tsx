import { GainsPageShell } from '@components/ui/gains/GainsPageShell';
import { GainsStreakBonuses } from '@components/ui/gains/GainsStreakBonuses';
import { GAINS_HISTORY_DEMO } from '@constants/gainsContent';
import { useAuthMe } from '@hooks/useAuthMe';
import { useGainsHubData } from '@hooks/useGainsHubData';

export function GainsMyPage() {
  const { data: me } = useAuthMe();
  const { data } = useGainsHubData();
  const points = me?.profile?.total_score ?? data?.totalPoints ?? 0;
  const history = data?.historyPreview?.length ? data.historyPreview : GAINS_HISTORY_DEMO;

  return (
    <GainsPageShell title="Mes gains" showBack>
      <div className="gains-stats3">
        <div className="gains-stat">
          <b>{points.toLocaleString('fr-FR')}</b>
          <span>Points</span>
        </div>
        <div className="gains-stat">
          <b>{data?.rewardsOwned ?? 2}</b>
          <span>Récompenses</span>
        </div>
        <div className="gains-stat">
          <b>{data?.offersCount ?? 3}</b>
          <span>Offres</span>
        </div>
      </div>
      <GainsStreakBonuses streakDays={data?.streakDays ?? me?.profile?.streak_days ?? 0} />
      <div className="gains-history-grid">
        {history.map((item) => (
          <article key={item.id} className="gains-reward">
            <div>
              <strong>{item.title}</strong>
              <p className="gains-footnote">
                {item.subtitle} · {item.whenLabel}
              </p>
            </div>
            {item.pointsDelta != null ? (
              <span
                className={
                  item.pointsDelta >= 0 ? 'gains-history-delta is-pos' : 'gains-history-delta is-neg'
                }
              >
                {item.pointsDelta > 0 ? `+${item.pointsDelta}` : item.pointsDelta} pts
              </span>
            ) : null}
          </article>
        ))}
      </div>
      <p className="gains-footnote">Selon le classement officiel Quizz+.</p>
    </GainsPageShell>
  );
}
