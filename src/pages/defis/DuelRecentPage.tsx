import { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

import { DefisNavbar } from '@components/ui/defis/DefisNavbar';
import { RecentDuelRow } from '@components/ui/defis/RecentDuelRow';
import { DUEL_LIST_PAGE_SIZE } from '@constants/duelList';
import { DefisRoutes } from '@constants/defisRoutes';
import { useAuthMe } from '@hooks/useAuthMe';
import { fetchRecentDuelsForUser } from '@services/defis/duelRepository';
import { openDuelFromList } from '@utils/defis/openDuelFromList';
import { resolveDuelOutcome } from '@utils/defis/resolveDuelOutcome';

function StatChip({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'win' | 'loss' | 'neutral';
}) {
  return (
    <div className={`duel-recent-stat is-${tone}`}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="duel-recent-legend-item">
      <i className="duel-recent-legend-dot" style={{ background: color }} aria-hidden />
      {label}
    </span>
  );
}

export function DuelRecentPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: me } = useAuthMe();
  const userId = me?.user?.id ?? '';
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
    isError,
  } = useInfiniteQuery({
    queryKey: ['duels-recent-list', userId],
    queryFn: ({ pageParam }) =>
      fetchRecentDuelsForUser(userId, { page: pageParam, limit: DUEL_LIST_PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.hasMore ? last.page + 1 : undefined),
    enabled: Boolean(userId),
  });

  const duels = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);
  const total = data?.pages[0]?.total ?? duels.length;
  const refreshing = isRefetching && !isFetchingNextPage;

  const stats = useMemo(() => {
    let victories = 0;
    let defeats = 0;
    let other = 0;
    for (const duel of duels) {
      const outcome = resolveDuelOutcome(duel, userId);
      if (outcome.won) victories += 1;
      else if (outcome.lost) defeats += 1;
      else other += 1;
    }
    return { victories, defeats, other };
  }, [duels, userId]);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, duels.length]);

  return (
    <div className="defis-page defis-page--shell">
      <div className="duel-recent-sticky">
        <DefisNavbar
          title={total > 0 ? `Mes duels récents (${total})` : 'Mes duels récents'}
          onBack={() => navigate(DefisRoutes.duelHub)}
        />
        <button
          type="button"
          className="duel-friends-refresh"
          onClick={() => void refetch()}
          disabled={refreshing}
        >
          {refreshing ? '…' : 'Actualiser'}
        </button>
      </div>

      <section className="duel-recent-hero" aria-label="Historique des duels">
        <span className="duel-recent-hero-emoji" aria-hidden>
          ⚡
        </span>
        <h2 className="duel-recent-hero-title">Historique des duels</h2>
        <p className="duel-recent-hero-subtitle">
          Revivez vos affrontements · Points · Victoires et défaites
        </p>
        {total > 0 ? (
          <div className="duel-recent-stats">
            <StatChip label="Victoires" value={String(stats.victories)} tone="win" />
            <StatChip label="Défaites" value={String(stats.defeats)} tone="loss" />
            <StatChip label="Autres" value={String(stats.other)} tone="neutral" />
          </div>
        ) : null}
      </section>

      {total > 0 ? (
        <div className="duel-recent-legend" aria-label="Légende">
          <LegendDot color="#2ECC71" label="Victoire" />
          <LegendDot color="#E8431A" label="Défaite" />
          <LegendDot color="#9CA3AF" label="Égalité / autre" />
        </div>
      ) : null}

      {isLoading ? (
        <div className="duel-hub-loader" role="status" aria-label="Chargement">
          <div className="defis-spinner is-primary" />
        </div>
      ) : null}

      {!isLoading && isError ? (
        <div className="duel-friends-empty-wrap">
          <p className="duel-friends-empty">Impossible de charger les duels récents.</p>
          <button type="button" className="duel-friends-refresh" onClick={() => void refetch()}>
            Réessayer
          </button>
        </div>
      ) : null}

      {!isLoading && !isError && duels.length === 0 ? (
        <div className="duel-recent-empty">
          <span className="duel-recent-empty-emoji" aria-hidden>
            ⚔️
          </span>
          <strong>Aucun duel terminé</strong>
          <p>Défiez un ami depuis l’accueil duel</p>
          <button
            type="button"
            className="duel-friends-refresh"
            onClick={() => navigate(DefisRoutes.duelHub)}
          >
            Retour au hub
          </button>
        </div>
      ) : null}

      {!isLoading && !isError ? (
        <div className="duel-recent-list">
          {duels.map((duel) => (
            <RecentDuelRow
              key={duel.id}
              duel={duel}
              userId={userId}
              onPress={() => openDuelFromList(navigate, queryClient, duel)}
            />
          ))}
        </div>
      ) : null}

      <div ref={loadMoreRef} className="duel-friends-sentinel" aria-hidden />

      {isFetchingNextPage ? (
        <div className="duel-hub-loader" role="status" aria-label="Chargement">
          <div className="defis-spinner is-primary" />
        </div>
      ) : null}

      {!isLoading && !isError && hasNextPage && !isFetchingNextPage ? (
        <button type="button" className="duel-friends-more" onClick={() => void fetchNextPage()}>
          Charger plus
        </button>
      ) : null}
    </div>
  );
}
