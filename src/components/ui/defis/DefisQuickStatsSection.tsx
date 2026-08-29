interface DefisQuickStatsSectionProps {
  defiPlayed: number;
  bestRank: number | null;
  duelsWon: number;
  duelsTotal: number;
}

export function DefisQuickStatsSection({
  defiPlayed,
  bestRank,
  duelsWon,
  duelsTotal,
}: DefisQuickStatsSectionProps) {
  return (
    <section className="defis-stats defis-fade defis-fade-d4">
      <article className="defis-stat">
        <p className="defis-stat-value">{defiPlayed}</p>
        <p className="defis-stat-label">Défis joués</p>
      </article>
      <article className="defis-stat">
        <p className="defis-stat-value">{bestRank ? `#${bestRank}` : '—'}</p>
        <p className="defis-stat-label">Meilleur rang</p>
      </article>
      <article className="defis-stat">
        <p className="defis-stat-value">
          {duelsWon}
          <span className="defis-stat-suffix"> / {duelsTotal}</span>
        </p>
        <p className="defis-stat-label">Duels gagnés</p>
      </article>
    </section>
  );
}
