import { useMemo, useState } from 'react';

import { GainsPageShell } from '@components/ui/gains/GainsPageShell';
import { Icon } from '@components/ui/Icon';
import { GAINS_REWARD_CATALOG, GAINS_REWARD_CATEGORIES } from '@constants/gainsContent';
import { useAuthMe } from '@hooks/useAuthMe';
import { notifyUser } from '@platform/notify';

function rewardCtaLabel(available: boolean, enough: boolean): string {
  if (!available) return 'Indisponible';
  if (!enough) return 'Pas assez';
  return 'Échanger';
}

export function GainsRewardsPage() {
  const { data: me } = useAuthMe();
  const points = me?.profile?.total_score ?? 0;
  const [category, setCategory] = useState<string | null>(null);

  const items = useMemo(
    () =>
      category
        ? GAINS_REWARD_CATALOG.filter((item) => item.category === category)
        : GAINS_REWARD_CATALOG,
    [category],
  );

  return (
    <GainsPageShell title="Récompenses" showBack>
      <div className="gains-sub-board gains-rewards-board">
        <section className="gains-rewards-balance gains-fade">
          <span>Vos points</span>
          <b>{points.toLocaleString('fr-FR')} pts</b>
        </section>

        <div className="gains-rewards-chips gains-fade" style={{ animationDelay: '60ms' }}>
          {GAINS_REWARD_CATEGORIES.map((label) => (
            <button
              key={label}
              type="button"
              className={category === label ? 'gains-rewards-chip is-on' : 'gains-rewards-chip'}
              onClick={() => setCategory((current) => (current === label ? null : label))}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="gains-rewards-list">
          {items.map((item, index) => {
            const enough = points >= item.costPoints;
            const canRedeem = item.available && enough;
            const ctaClass = canRedeem
              ? 'gains-rewards-cta'
              : item.available
                ? 'gains-rewards-cta is-low'
                : 'gains-rewards-cta is-off';

            return (
              <article
                key={item.id}
                className="gains-rewards-card gains-fade"
                style={{ animationDelay: `${100 + index * 60}ms` }}
              >
                <div className="gains-rewards-card-top">
                  <span className="gains-rewards-icon">
                    <Icon name="shopping-bag" size={16} color="#1F2347" />
                  </span>
                  <div className="gains-rewards-copy">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
                <div className="gains-rewards-card-bottom">
                  <strong>{item.costPoints.toLocaleString('fr-FR')} pts</strong>
                  <button
                    type="button"
                    className={ctaClass}
                    disabled={!canRedeem}
                    onClick={() =>
                      notifyUser(
                        'Échange bientôt disponible',
                        'La validation des récompenses arrive dans une prochaine version.',
                      )
                    }
                  >
                    {rewardCtaLabel(item.available, enough)}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </GainsPageShell>
  );
}
