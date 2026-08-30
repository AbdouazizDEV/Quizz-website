import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

import { DefisNavbar } from '@components/ui/defis/DefisNavbar';
import { DuelFriendRow } from '@components/ui/defis/DuelFriendRow';
import { DuelSentModal } from '@components/ui/defis/DuelSentModal';
import { DUEL_LIST_PAGE_SIZE } from '@constants/duelList';
import { DefisRoutes } from '@constants/defisRoutes';
import { useAuthMe } from '@hooks/useAuthMe';
import { notifyUser } from '@platform/notify';
import { useAppError } from '@providers/AppErrorProvider';
import type { DuelSummary } from '@app-types/challenge.types';
import { createFriendDuel } from '@services/defis/duelRepository';
import { fetchFriendsForDuelPaginated } from '@services/defis/duelFriendsSearch';

export function DuelFriendsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: me } = useAuthMe();
  const userId = me?.user?.id ?? '';
  const { showAppError } = useAppError();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sentModal, setSentModal] = useState<{
    duel: DuelSummary;
    friendName: string;
  } | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

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
    queryKey: ['duel-friends-list', userId, debouncedSearch.trim()],
    queryFn: ({ pageParam }) =>
      fetchFriendsForDuelPaginated(debouncedSearch, pageParam, DUEL_LIST_PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.hasMore ? last.page + 1 : undefined),
    enabled: Boolean(userId),
  });

  const friends = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);
  const refreshing = isRefetching && !isFetchingNextPage;

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
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, friends.length]);

  const refreshDuels = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['duels-pending'] });
    await queryClient.invalidateQueries({ queryKey: ['duels-recent'] });
  }, [queryClient]);

  const onChallengeFriend = async (friendName: string, friendId: string) => {
    if (!userId) return;
    try {
      const result = await createFriendDuel(userId, friendId);
      await refreshDuels();
      if (result.queued) {
        notifyUser('Duel', 'Défi enregistré — synchronisation à la reconnexion.');
        return;
      }
      if (result.data) {
        setSentModal({ duel: result.data, friendName });
      }
    } catch (error) {
      showAppError(error instanceof Error ? error.message : 'Impossible de créer le duel.', {
        title: 'Duel',
      });
    }
  };

  return (
    <div className="defis-page defis-page--shell duel-friends-page">
      <div className="duel-friends-sticky">
        <DefisNavbar title="Amis" onBack={() => navigate(DefisRoutes.duelHub)} />
        <div className="duel-friends-search-row">
          <input
            className="duel-hub-search"
            placeholder="🔍 Rechercher un ami..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            autoCapitalize="none"
            autoCorrect="off"
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
      </div>

      {isLoading ? (
        <div className="duel-hub-loader" role="status" aria-label="Chargement">
          <div className="defis-spinner is-primary" />
        </div>
      ) : null}

      {!isLoading && isError ? (
        <div className="duel-friends-empty-wrap">
          <p className="duel-friends-empty">Impossible de charger vos amis.</p>
          <button type="button" className="duel-friends-refresh" onClick={() => void refetch()}>
            Réessayer
          </button>
        </div>
      ) : null}

      {!isLoading && !isError && friends.length === 0 ? (
        <p className="duel-friends-empty">
          {search.trim() ? 'Aucun ami trouvé' : 'Ajoutez des amis pour les défier'}
        </p>
      ) : null}

      {!isLoading && !isError ? (
        <div className="duel-friends-list">
          {friends.map((friend) => (
            <DuelFriendRow
              key={friend.id}
              friend={friend}
              onChallenge={() => void onChallengeFriend(friend.displayName, friend.id)}
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
        <button
          type="button"
          className="duel-friends-more"
          onClick={() => void fetchNextPage()}
        >
          Charger plus
        </button>
      ) : null}

      <DuelSentModal
        open={sentModal !== null}
        friendName={sentModal?.friendName ?? ''}
        questionsCount={sentModal?.duel.questionsCount ?? 15}
        expiresAt={sentModal?.duel.expiresAt ?? new Date().toISOString()}
        onLater={() => setSentModal(null)}
        onPlayNow={() => {
          const duelId = sentModal?.duel.id;
          setSentModal(null);
          if (duelId) navigate(DefisRoutes.duelDetail(duelId));
        }}
      />
    </div>
  );
}
