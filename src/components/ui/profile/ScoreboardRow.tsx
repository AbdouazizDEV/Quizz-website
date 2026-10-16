import { Link } from 'react-router-dom';

import type { LeaderboardItem } from '@app-types/leaderboard.types';
import { BadgeChip } from '@components/ui/badges/BadgeChip';
import { LevelBadge } from '@components/ui/home/LevelBadge';
import { buildUserProfileHref } from '@constants/Routes';
import type { PlayerBadgeView } from '@constants/westAfricanBadges';
import { getUserAvatarUri } from '@utils/getUserAvatarUri';
import { levelCodeFromScore } from '@utils/levelDisplay';

interface ScoreboardRowProps {
  item: LeaderboardItem;
  highlighted: boolean;
  featuredBadge?: PlayerBadgeView | null;
}

export function ScoreboardRow({ item, highlighted, featuredBadge }: ScoreboardRowProps) {
  const initial = item.displayName[0]?.toUpperCase() ?? '?';

  return (
    <Link
      to={buildUserProfileHref(item.id)}
      className={highlighted ? 'scoreboard-row is-me' : 'scoreboard-row'}
    >
      <span className="scoreboard-rank">{item.rank}</span>
      <span className="scoreboard-avatar">
        {item.avatarUrl ? (
          <img src={item.avatarUrl || getUserAvatarUri(item.id)} alt="" />
        ) : (
          <em>{initial}</em>
        )}
      </span>
      <span className="scoreboard-name">
        {item.displayName}
        {highlighted && featuredBadge ? <BadgeChip badge={featuredBadge} /> : null}
      </span>
      <LevelBadge code={levelCodeFromScore(item.score)} compact />
      <span className="scoreboard-score">{item.score}</span>
    </Link>
  );
}
