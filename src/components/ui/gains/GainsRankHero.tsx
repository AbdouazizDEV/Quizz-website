import { Icon } from '@components/ui/Icon';
import { useCountUp } from '@hooks/useCountUp';

interface GainsRankHeroProps {
  rank: number | null;
  totalPoints: number;
  pointsToTop3: number | null;
}

export function GainsRankHero({ rank, totalPoints, pointsToTop3 }: GainsRankHeroProps) {
  const animatedPoints = useCountUp(totalPoints, 900);
  const inTop3 = rank != null && rank <= 3;
  const progress = inTop3
    ? 1
    : totalPoints + (pointsToTop3 ?? 0) > 0
      ? totalPoints / (totalPoints + (pointsToTop3 ?? 1))
      : 0;

  return (
    <section className="gains-rank">
      <div className="gains-rank-kicker">
        <span className="gains-rank-award">
          <Icon name="award" size={16} color="#1A1A2E" />
        </span>
        Mon rang
      </div>
      <p className="gains-rank-title">
        Tu es {rank != null ? <span>#{rank}</span> : <span>#—</span>}
      </p>
      <p className="gains-rank-points">{animatedPoints.toLocaleString('fr-FR')} pts</p>
      <div className="gains-rank-bar" aria-hidden>
        <span style={{ width: `${Math.round(Math.min(1, Math.max(0, progress)) * 100)}%` }} />
      </div>
      <p className="gains-rank-hint">
        {inTop3
          ? 'Tu es dans le Top 3 — continue comme ça !'
          : `Encore ${pointsToTop3 ?? 0} pts pour le Top 3`}
      </p>
    </section>
  );
}
