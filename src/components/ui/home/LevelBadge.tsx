import { levelBadgeFor } from '@constants/levelBadges';

export function LevelBadge({ code, compact = false }: { code?: string; compact?: boolean }) {
  const badge = levelBadgeFor(code);
  return (
    <span
      className={compact ? 'level-badge is-compact' : 'level-badge'}
      style={{ background: badge.tint }}
      title={`Niveau ${badge.step}`}
      aria-hidden
    >
      {badge.mark}
    </span>
  );
}
