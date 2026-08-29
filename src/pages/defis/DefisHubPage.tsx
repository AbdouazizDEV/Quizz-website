import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { DefisActionTiles } from '@components/ui/defis/DefisActionTiles';
import { DefisFeaturedChallengeCard } from '@components/ui/defis/DefisFeaturedChallengeCard';
import { DefisNavbar } from '@components/ui/defis/DefisNavbar';
import { DefisQuickStatsSection } from '@components/ui/defis/DefisQuickStatsSection';
import { DefisStateViews } from '@components/ui/defis/DefisStateViews';
import { DefisSummaryCard } from '@components/ui/defis/DefisSummaryCard';
import { DefisRoutes } from '@constants/defisRoutes';
import { Routes } from '@constants/Routes';
import type { HomeActionTileId } from '@constants/homeActionTiles';
import { useAuthMe } from '@hooks/useAuthMe';
import { useDefisDashboard } from '@hooks/defis/useDefisDashboard';
import { buildDefisSummaryItems } from '@utils/defis/buildDefisSummaryItems';

export function DefisHubPage() {
  const navigate = useNavigate();
  const { data: me } = useAuthMe();
  const { data, isLoading, error, refetch } = useDefisDashboard(me?.user?.id);

  const go = useCallback(
    (id: HomeActionTileId) => {
      if (id === 'challenge') navigate(DefisRoutes.challengeList);
      if (id === 'tournament') navigate(DefisRoutes.tournoiList);
      if (id === 'duel') navigate(DefisRoutes.duelHub);
    },
    [navigate],
  );

  const counts = data ?? {
    activeChallengeCount: 0,
    activeTournamentCount: 0,
    pendingDuelCount: 0,
    currentWeekChallenge: null,
    userStats: { defiPlayed: 0, bestRank: null, duelsWon: 0, duelsTotal: 0 },
  };

  return (
    <div className="defis-page defis-hub">
      <DefisNavbar title="Défis" onBack={() => navigate(Routes.HOME)} />
      <p className="defis-hub-intro">Challenge hebdo, tournois et duels — joue, grimpe, gagne.</p>
      {isLoading && !data ? <DefisStateViews loading /> : null}
      {error && !data ? (
        <DefisStateViews error={error instanceof Error ? error : String(error)} onRetry={() => void refetch()} />
      ) : null}
      {data || !isLoading ? (
        <>
          <DefisSummaryCard items={buildDefisSummaryItems(counts)} onPress={go} />
          <DefisActionTiles
            onTilePress={go}
            pulseIds={{
              challenge: counts.activeChallengeCount > 0,
              tournament: counts.activeTournamentCount > 0,
              duel: counts.pendingDuelCount > 0,
            }}
          />
          <div className="defis-hub-lower">
            <DefisFeaturedChallengeCard
              id={counts.currentWeekChallenge?.id}
              title={counts.currentWeekChallenge?.title}
              endsAt={counts.currentWeekChallenge?.endsAt}
              onPress={() => {
                const id = counts.currentWeekChallenge?.id;
                if (id) navigate(DefisRoutes.challengeDetail(id));
              }}
            />
            <DefisQuickStatsSection
              defiPlayed={counts.userStats.defiPlayed}
              bestRank={counts.userStats.bestRank}
              duelsWon={counts.userStats.duelsWon}
              duelsTotal={counts.userStats.duelsTotal}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
