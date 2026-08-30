import { GainsPageShell } from '@components/ui/gains/GainsPageShell';
import { GainsStreakBonuses } from '@components/ui/gains/GainsStreakBonuses';
import { Icon } from '@components/ui/Icon';
import { GAINS_HISTORY_DEMO } from '@constants/gainsContent';
import { useAuthMe } from '@hooks/useAuthMe';
import { useGainsHubData } from '@hooks/useGainsHubData';

export function GainsMyPage() {
  const { data: me } = useAuthMe();
  const { data } = useGainsHubData();
  const points = me?.profile?.total_score ?? 0;
  const streak = data?.streakDays ?? me?.profile?.streak_days ?? 0;
  const history = data?.historyPreview?.length ? data.historyPreview : GAINS_HISTORY_DEMO;

  return (
    <GainsPageShell title="Mes gains" showBack>
      <div className="gains-sub-board gains-my-board">
        <div className="gains-stats3 gains-fade">
          <div className="gains-stat">
            <b>{points.toLocaleString('fr-FR')}</b>
            <span>Points</span>
          </div>
          <div className="gains-stat">
            <b>2</b>
            <span>Récompenses</span>
          </div>
          <div className="gains-stat">
            <b>3</b>
            <span>Offres</span>
          </div>
        </div>

        <div className="gains-my-split">
          <GainsStreakBonuses streakDays={streak} />

          <section className="gains-history-card gains-fade" style={{ animationDelay: '120ms' }}>
            <div className="gains-history-head">
              <Icon name="bookmark" size={16} color="#1F2347" />
              <h2>Historique</h2>
            </div>
            {history.map((item, index) => (
              <article
                key={item.id}
                className="gains-history-row gains-fade"
                style={{ animationDelay: `${160 + index * 60}ms` }}
              >
                <div>
                  <strong>{item.title}</strong>
                  <p>
                    {item.subtitle} · {item.whenLabel}
                  </p>
                </div>
                {typeof item.pointsDelta === 'number' ? (
                  <span
                    className={
                      item.pointsDelta >= 0 ? 'gains-history-delta is-pos' : 'gains-history-delta is-neg'
                    }
                  >
                    {item.pointsDelta >= 0 ? `+${item.pointsDelta}` : item.pointsDelta} pts
                  </span>
                ) : null}
              </article>
            ))}
          </section>
        </div>
      </div>

      <p className="gains-prizes-footnote">Selon le classement officiel Quizz+.</p>
    </GainsPageShell>
  );
}
