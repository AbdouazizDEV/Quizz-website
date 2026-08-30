import type { ProfileStatItem } from '@app-types/profile.types';

interface ProfileStatsGridProps {
  stats: ProfileStatItem[];
}

export function ProfileStatsGrid({ stats }: ProfileStatsGridProps) {
  const row1 = stats.slice(0, 3);
  const row2 = stats.slice(3, 6);

  return (
    <div className="profile-stats-grid">
      <div className="profile-stats-row">
        {row1.map((item, i) => (
          <StatCell key={item.id} item={item} showDivider={i < row1.length - 1} />
        ))}
      </div>
      {row2.length > 0 ? (
        <>
          <hr className="profile-stats-hline" />
          <div className="profile-stats-row">
            {row2.map((item, i) => (
              <StatCell key={item.id} item={item} showDivider={i < row2.length - 1} />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

function StatCell({ item, showDivider }: { item: ProfileStatItem; showDivider: boolean }) {
  return (
    <>
      <div className="profile-stats-cell">
        <b>{item.valueLabel}</b>
        <span>{item.caption}</span>
      </div>
      {showDivider ? <span className="profile-stats-vline" aria-hidden /> : null}
    </>
  );
}
