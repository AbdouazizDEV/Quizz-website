interface ChallengeMyRankCardProps {
  rank: number | null;
  score: number;
  pointsToNext: number | null;
}

export function ChallengeMyRankCard({ rank, score, pointsToNext }: ChallengeMyRankCardProps) {
  return (
    <section className="defis-rank-card defis-fade">
      <div>
        <p className="defis-muted">Mon rang</p>
        <h3 className="defis-card-title">{rank ? `#${rank}` : 'Non classé'}</h3>
      </div>
      <div style={{ textAlign: 'right' }}>
        <strong>{score} pts</strong>
        <p className="defis-muted">
          {pointsToNext != null && rank && rank > 1
            ? `${pointsToNext} pts pour le rang supérieur`
            : 'Continue pour grimper'}
        </p>
      </div>
    </section>
  );
}
