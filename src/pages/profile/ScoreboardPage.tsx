import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Icon } from '@components/ui/Icon';
import { ScoreboardList } from '@components/ui/profile/ScoreboardList';
import { Routes } from '@constants/Routes';
import { pickFeaturedBadge } from '@constants/westAfricanBadges';
import { useGlobalLeaderboard } from '@hooks/useGlobalLeaderboard';
import { usePlayerBadges } from '@hooks/usePlayerBadges';

export function ScoreboardPage() {
  const navigate = useNavigate();
  const { items, me, loading, error, refetch } = useGlobalLeaderboard(100);
  const { badges } = usePlayerBadges();
  const featuredBadge = pickFeaturedBadge(badges);

  const onBack = useCallback(() => {
    if (window.history.length > 1) navigate(-1);
    else navigate(Routes.HOME, { replace: true });
  }, [navigate]);

  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === 'hidden') return;
      void refetch();
    };
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
        <button type="button" className="scoreboard-navbar-side" aria-label="Retour" onClick={onBack}>
          <Icon name="arrow-left" size={22} color="#FFFFFF" />
        </button>
        <h1>Joueurs</h1>
        <span className="scoreboard-navbar-side" aria-hidden />
      </header>

      <div className="scoreboard-list-wrap">
        <ScoreboardList
          items={items}
          currentUserId={me?.userId}
          loading={loading}
          error={error ? 'Impossible de charger le classement.' : undefined}
          onRetry={() => void refetch()}
          featuredBadge={featuredBadge}
        />
      </div>
    </div>
  );
}
