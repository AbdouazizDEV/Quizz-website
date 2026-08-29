import { Link } from 'react-router-dom';

import type { GainsLeaderboardRow } from '@app-types/gains.types';
import { buildUserProfileHref, Routes } from '@constants/Routes';

interface GainsLeaderboardCardProps {
  rows: GainsLeaderboardRow[];
}

export function GainsLeaderboardCard({ rows }: GainsLeaderboardCardProps) {
  return (
    <section className="gains-board">
      <div className="gains-board-head">
        <h2>Classement</h2>
        <Link to={Routes.PLAYERS} style={{ fontWeight: 800, color: '#C9A000', textDecoration: 'none' }}>
          Voir tout
        </Link>
      </div>
      {rows.length === 0 ? (
        <p className="gains-footnote">Aucun classement pour le moment.</p>
      ) : (
        rows.map((row) => (
          <div key={`${row.id}-${row.rank}`} className={row.isMe ? 'gains-board-row is-me' : 'gains-board-row'}>
            <span>
              #{row.rank}{' '}
              <Link
                to={row.isMe ? Routes.PROFILE : buildUserProfileHref(row.id)}
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                {row.name}
              </Link>
            </span>
            <span>{row.points.toLocaleString('fr-FR')} pts</span>
          </div>
        ))
      )}
    </section>
  );
}
