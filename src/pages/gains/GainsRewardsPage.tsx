import { useMemo, useState } from 'react';

import { GainsPageShell } from '@components/ui/gains/GainsPageShell';
import { GAINS_REWARD_CATALOG, GAINS_REWARD_CATEGORIES } from '@constants/gainsContent';
import { useAuthMe } from '@hooks/useAuthMe';
import { notifyUser } from '@platform/notify';

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
      <section className="gains-balance">
        <span>Tes points disponibles</span>
        <b>{points.toLocaleString('fr-FR')} pts</b>
      </section>
      <div className="gains-chips">
        {GAINS_REWARD_CATEGORIES.map((label) => (
          <button
            key={label}
            type="button"
            className={category === label ? 'gains-chip is-on' : 'gains-chip'}
            onClick={() => setCategory((current) => (current === label ? null : label))}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="gains-reward-grid">
        {items.map((item) => {
          const enough = points >= item.costPoints;
          const label = !item.available ? 'Indisponible' : enough ? 'Échanger' : 'Pas assez';
          return (
            <article key={item.id} className="gains-reward">
              <div>
                <strong>{item.title}</strong>
                <p className="gains-footnote">
                  {item.category} · {item.costPoints.toLocaleString('fr-FR')} pts
                </p>
              </div>
              <button
                type="button"
                className="gains-cta"
                disabled={!item.available || !enough}
                onClick={() => notifyUser('Récompenses', 'Échange bientôt disponible')}
              >
                {label}
              </button>
            </article>
          );
        })}
      </div>
    </GainsPageShell>
  );
}
