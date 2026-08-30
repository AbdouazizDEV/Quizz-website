import type { AchievementStat } from '@app-types/statistics.types';
import { AchievementStatCard } from '@components/ui/statistics/AchievementStatCard';

interface AchievementsSectionProps {
  achievements: AchievementStat[];
}

export function AchievementsSection({ achievements }: AchievementsSectionProps) {
  return (
    <section className="stats-achievements">
      <div className="stats-achievements-intro gains-fade">
        <h2>En un coup d’œil</h2>
        <p>Tes indicateurs essentiels</p>
      </div>
      <div className="stats-achievements-grid">
        {achievements.map((item, index) => (
          <AchievementStatCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}
