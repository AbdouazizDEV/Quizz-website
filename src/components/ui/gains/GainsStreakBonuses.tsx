import { GAINS_STREAK_TIERS } from '@constants/gainsContent';

interface GainsStreakBonusesProps {
  streakDays: number;
}

export function GainsStreakBonuses({ streakDays }: GainsStreakBonusesProps) {
  const nextTier = GAINS_STREAK_TIERS.find((tier) => streakDays < tier.days);

  return (
    <section className="gains-streak">
      <h2>Bonus de série · {streakDays} j</h2>
      <div className="gains-streak-row">
        {GAINS_STREAK_TIERS.map((tier) => {
          const unlocked = streakDays >= tier.days;
          const isNext = nextTier?.id === tier.id;
          return (
            <div key={tier.id} className="gains-streak-item">
              <div
                className={`gains-streak-dot${unlocked ? ' is-on' : ''}${isNext ? ' is-next' : ''}`}
              />
              <p>{tier.label}</p>
              <p>{`+${tier.bonusPoints} pts`}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
