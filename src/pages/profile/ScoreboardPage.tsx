import { useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Icon } from '@components/ui/Icon';
import { Routes, buildUserProfileHref } from '@constants/Routes';
import { useGlobalLeaderboard } from '@hooks/useGlobalLeaderboard';
import { getUserAvatarUri } from '@utils/getUserAvatarUri';

export function ScoreboardPage() {
  const navigate = useNavigate();
  const { items, me, loading, error, refetch } = useGlobalLeaderboard(100);

  const onBack = useCallback(() => {
    if (window.history.length > 1) navigate(-1);
    else navigate(Routes.HOME, { replace: true });
  }, [navigate]);

  useEffect(() => {
    const refresh = () => void refetch();
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [refetch]);

  return (
    <div className="scoreboard-page">
      <header className="scoreboard-navbar">
        <button type="button" className="defis-navbar-side" aria-label="Retour" onClick={onBack}>
          <Icon name="chevron-left" size={26} color="#FFFFFF" />
        </button>
        <h1>Joueurs</h1>
        <span className="defis-navbar-side" />
      </header>
      {loading ? <div className="scoreboard-spinner" aria-label="Chargement" /> : null}
      {error && !loading ? (
        <div className="defis-state">
          <p className="defis-error" style={{ color: '#fff' }}>
            Impossible de charger le classement.
          </p>
          <button type="button" className="defis-retry" onClick={() => void refetch()}>
            Réessayer
          </button>
        </div>
      ) : null}
      {!loading && !error && items.length === 0 ? (
        <p className="defis-muted" style={{ color: '#fff', textAlign: 'center' }}>
          Aucun score disponible pour le moment.
        </p>
      ) : null}
      <div className="scoreboard-list">
        {items.map((row) => {
          const isMe = me?.userId === row.id;
          return (
            <Link
              key={row.id}
              to={buildUserProfileHref(row.id)}
              className={isMe ? 'scoreboard-row is-me' : 'scoreboard-row'}
            >
              <span className="scoreboard-rank">#{row.rank}</span>
              <span className="defis-avatar" style={{ width: 40, height: 40, margin: 0 }}>
                <img src={row.avatarUrl || getUserAvatarUri(row.id)} alt="" />
              </span>
              <span className="scoreboard-name">{row.displayName}</span>
              <span className="scoreboard-score">{row.score} pts</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
