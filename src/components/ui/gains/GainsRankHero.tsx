import { Icon } from '@components/ui/Icon';
import { useCountUp } from '@hooks/useCountUp';

interface GainsRankHeroProps {
  rank: number | null;
  totalPoints: number;
  pointsToTop3: number | null;
}

export function GainsRankHero({ rank, totalPoints, pointsToTop3 }: GainsRankHeroProps) {
  const animatedPoints = useCountUp(totalPoints, 900);
  const progress =
    pointsToTop3 == null || pointsToTop3 <= 0
      ? 1
      : Math.min(1, Math.max(0.12, 1 - pointsToTop3 / Math.max(totalPoints + pointsToTop3, 1)));

  return (
    <section className="gains-rank gains-fade">
      <div className="gains-rank-kicker">
        <span className="gains-rank-award">
          <Icon name="award" size={18} color="#1F2347" />
        </span>
        Mon rang
      </div>
      <p className="gains-rank-title">
        Tu es <span>#{rank ?? '—'}</span>
      </p>
      <p className="gains-rank-points">{animatedPoints.toLocaleString('fr-FR')} pts</p>
      <div className="gains-rank-bar" aria-hidden>
        <span style={{ width: `${Math.round(progress * 100)}%` }} />
      </div>
      <p className="gains-rank-hint">
        {pointsToTop3 == null || pointsToTop3 <= 0
          ? 'Tu es dans le Top 3 — continue comme ça !'
          : `Encore ${pointsToTop3.toLocaleString('fr-FR')} pts pour le Top 3`}
      </p>
    </section>
  );
}
