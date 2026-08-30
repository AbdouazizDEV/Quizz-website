import type { CSSProperties } from 'react';

import type { AchievementStat } from '@app-types/statistics.types';
import { QuizzoLogoMark } from '@components/ui/brand/QuizzoLogoMark';
import { Icon, type AppIconName } from '@components/ui/Icon';

const ICON_NAME: Record<Exclude<AchievementStat['icon'], 'quizzo'>, AppIconName> = {
  coin: 'star',
  flame: 'zap',
  medal: 'award',
  target: 'calendar',
  clock: 'clock',
};

interface AchievementStatCardProps {
  item: AchievementStat;
  index?: number;
}

export function AchievementStatCard({ item, index = 0 }: AchievementStatCardProps) {
  return (
    <article
      className="stats-achievement gains-fade"
      style={{ '--stagger': `${140 + index * 70}ms` } as CSSProperties}
    >
      <span className={`stats-achievement-icon is-${item.icon}`}>
        {item.icon === 'quizzo' ? (
          <QuizzoLogoMark size={26} />
        ) : (
          <Icon name={ICON_NAME[item.icon]} size={20} />
        )}
      </span>
      <strong>{item.valueFormatted}</strong>
      <span>{item.label}</span>
    </article>
  );
}
