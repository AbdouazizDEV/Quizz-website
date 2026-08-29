import type { ChallengeLeaderboardEntry } from '@app-types/challenge.types';

interface ChallengePodiumProps {
  entries: ChallengeLeaderboardEntry[];
}

export function ChallengePodium({ entries }: ChallengePodiumProps) {
  const first = entries.find((e) => e.rank === 1);
  const second = entries.find((e) => e.rank === 2);
  const third = entries.find((e) => e.rank === 3);
  if (!first && !second && !third) return null;

  const Item = ({ entry, place }: { entry?: ChallengeLeaderboardEntry; place: 1 | 2 | 3 }) => (
    <div className={`defis-podium-item is-${place}`}>
      <div style={{ fontSize: 22 }}>{place === 1 ? '🥇' : place === 2 ? '🥈' : '🥉'}</div>
      <strong>{entry?.displayName ?? '—'}</strong>
      <div>{entry ? `${entry.totalScore} pts` : ''}</div>
    </div>
  );

  return (
    <div className="defis-podium defis-fade">
      <Item entry={second} place={2} />
      <Item entry={first} place={1} />
      <Item entry={third} place={3} />
    </div>
  );
}
