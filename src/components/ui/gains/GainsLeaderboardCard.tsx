import { useState } from 'react';
import { Link } from 'react-router-dom';

import type { GainsLeaderboardRow, GainsPeriod } from '@app-types/gains.types';
import { Icon } from '@components/ui/Icon';
import { Routes } from '@constants/Routes';

const PERIODS: { id: GainsPeriod; label: string }[] = [
  { id: 'week', label: 'Semaine' },
  { id: 'month', label: 'Mois' },
  { id: 'year', label: 'Année' },
];

interface GainsLeaderboardCardProps {
  rows: GainsLeaderboardRow[];
  seeAllHref?: string;
}

export function GainsLeaderboardCard({
  rows,
  seeAllHref = Routes.SCOREBOARD,
}: GainsLeaderboardCardProps) {
  const [period, setPeriod] = useState<GainsPeriod>('week');

  return (
    <section className="gains-board gains-fade" style={{ animationDelay: '140ms' }}>
      <div className="gains-board-head">
        <span className="gains-board-icon">
          <Icon name="flag" size={16} color="#1F2347" />
        </span>
        <h2>Classement</h2>
        <Link to={seeAllHref} className="gains-board-see">
          Voir tout
        </Link>
      </div>

      <div className="gains-board-tabs" role="tablist">
        {PERIODS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={period === item.id}
            className={period === item.id ? 'is-on' : undefined}
            onClick={() => setPeriod(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="gains-board-empty">Classement en cours de chargement…</p>
      ) : (
        <div className="gains-board-list">
          {rows.map((row, index) => (
            <div
              key={`${period}-${row.id}`}
              className={row.isMe ? 'gains-board-row is-me gains-fade' : 'gains-board-row gains-fade'}
              style={{ animationDelay: `${40 * index}ms` }}
            >
              <span className="gains-board-rank">#{row.rank}</span>
              <span className="gains-board-name">{row.isMe ? 'Toi' : row.name}</span>
              <span className="gains-board-pts">{row.points.toLocaleString('fr-FR')} pts</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
