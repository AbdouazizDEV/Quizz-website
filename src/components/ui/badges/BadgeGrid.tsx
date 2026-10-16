import { useEffect, useMemo, useRef, useState } from 'react';

import { BadgeMedallion } from '@components/ui/badges/BadgeMedallion';
import type { PlayerBadgeView } from '@constants/westAfricanBadges';

export function BadgeGrid({ badges }: { badges: PlayerBadgeView[] }) {
  const prev = useRef<Set<string>>(new Set());
  const [opened, setOpened] = useState<PlayerBadgeView | null>(null);
  const [justEarned, setJustEarned] = useState<Set<string>>(new Set());

  useEffect(() => {
    const next = new Set(badges.filter((b) => b.earned).map((b) => b.code));
    const fresh = [...next].filter((code) => !prev.current.has(code));
    if (prev.current.size > 0 && fresh.length) setJustEarned(new Set(fresh));
    prev.current = next;
  }, [badges]);

  const items = useMemo(() => badges, [badges]);

  return (
    <>
      <ul className="badge-grid">
        {items.map((badge) => (
          <li key={badge.code} className="badge-grid-item">
            <BadgeMedallion
              badge={badge}
              size="md"
              celebrate={justEarned.has(badge.code)}
              onClick={() => setOpened(badge)}
            />
            <p className="badge-grid-name">{badge.name}</p>
            <p className="badge-grid-motif">{badge.motif}</p>
            <p className={`badge-grid-state ${badge.earned ? 'is-on' : ''}`}>
              {badge.earned ? 'Obtenu' : 'À gagner'}
            </p>
          </li>
        ))}
      </ul>

      {opened ? (
        <div className="badge-detail" role="dialog" aria-modal="true" aria-labelledby="badge-detail-title">
          <button type="button" className="badge-detail-backdrop" aria-label="Fermer" onClick={() => setOpened(null)} />
          <div className="badge-detail-card">
            <BadgeMedallion badge={opened} size="lg" celebrate={opened.earned} />
            <h3 id="badge-detail-title">{opened.name}</h3>
            <p className="badge-grid-motif">{opened.motif}</p>
            <p className="badge-detail-how">{opened.how}</p>
            <p className={`badge-grid-state ${opened.earned ? 'is-on' : ''}`}>
              {opened.earned ? 'Obtenu' : 'À gagner'}
            </p>
            <button type="button" className="premium-status-cta" onClick={() => setOpened(null)}>
              Fermer
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
