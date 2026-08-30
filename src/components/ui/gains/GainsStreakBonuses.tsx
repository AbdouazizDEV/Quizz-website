import { Icon } from '@components/ui/Icon';
import { GAINS_STREAK_TIERS } from '@constants/gainsContent';

interface GainsStreakBonusesProps {
  streakDays: number;
}

export function GainsStreakBonuses({ streakDays }: GainsStreakBonusesProps) {
  const daysLabel = `${streakDays} jour${streakDays > 1 ? 's' : ''}`;

  return (
    <section className="gains-streak gains-fade" style={{ animationDelay: '100ms' }}>
      <div className="gains-streak-head">
        <span className="gains-streak-icon">
          <Icon name="activity" size={16} color="#F97316" />
        </span>
        <div>
          <h2>Bonus de série</h2>
          <p>
            Série actuelle : <strong>{daysLabel}</strong>
          </p>
        </div>
      </div>
      <div className="gains-streak-row">
        {GAINS_STREAK_TIERS.map((tier, index) => {
          const unlocked = streakDays >= tier.days;
          const isNext =
            streakDays < tier.days &&
            (index === 0 || streakDays >= GAINS_STREAK_TIERS[index - 1]!.days);
          return (
            <div key={tier.id} className="gains-streak-item">
              <div
                className={`gains-streak-dot${unlocked ? ' is-on' : ''}${isNext ? ' is-next' : ''}`}
              />
              <p className={unlocked ? 'is-on' : undefined}>{tier.label}</p>
              <p className={unlocked ? 'is-on is-hint' : 'is-hint'}>{tier.hint}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
