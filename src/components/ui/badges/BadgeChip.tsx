import { BadgeMedallion } from '@components/ui/badges/BadgeMedallion';
import type { PlayerBadgeView } from '@constants/westAfricanBadges';

export function BadgeChip({ badge }: { badge: PlayerBadgeView }) {
  if (!badge.earned) return null;
  return (
    <span className="badge-chip" title={`${badge.name} · ${badge.motif}`}>
      <BadgeMedallion badge={badge} size="sm" tabIndex={-1} />
    </span>
  );
}
