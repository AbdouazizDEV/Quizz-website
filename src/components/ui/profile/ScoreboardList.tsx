import type { LeaderboardItem } from '@app-types/leaderboard.types';
import { ScoreboardRow } from '@components/ui/profile/ScoreboardRow';
import type { PlayerBadgeView } from '@constants/westAfricanBadges';

interface ScoreboardListProps {
  items: LeaderboardItem[];
  currentUserId?: string;
  loading: boolean;
  error?: string;
  onRetry?: () => void;
  featuredBadge?: PlayerBadgeView | null;
}

export function ScoreboardList({
  items,
  currentUserId,
  loading,
  error,
  onRetry,
  featuredBadge,
}: ScoreboardListProps) {
  if (loading) {
    return (
      <div className="scoreboard-state" role="status" aria-label="Chargement">
        <div className="scoreboard-spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="scoreboard-state">
        <p>{error}</p>
        {onRetry ? (
          <button type="button" className="scoreboard-retry" onClick={onRetry}>
            Réessayer
          </button>
        ) : null}
      </div>
    );
  }

  if (items.length === 0) {
    return <p className="scoreboard-state">Aucun score disponible pour le moment.</p>;
  }

  return (
    <div className="scoreboard-list">
      {items.map((item) => (
        <ScoreboardRow
          key={item.id}
          item={item}
          highlighted={item.id === currentUserId}
          featuredBadge={item.id === currentUserId ? featuredBadge : null}
        />
      ))}
    </div>
  );
}
