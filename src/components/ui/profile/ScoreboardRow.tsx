import { Link } from 'react-router-dom';

import type { LeaderboardItem } from '@app-types/leaderboard.types';
import { buildUserProfileHref } from '@constants/Routes';
import { getUserAvatarUri } from '@utils/getUserAvatarUri';

interface ScoreboardRowProps {
  item: LeaderboardItem;
  highlighted: boolean;
}

export function ScoreboardRow({ item, highlighted }: ScoreboardRowProps) {
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
      <span className="scoreboard-name">{item.displayName}</span>
      <span className="scoreboard-score">{item.score}</span>
    </Link>
  );
}
