import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { ActiveDuelCard } from '@components/ui/defis/ActiveDuelCard';
import { DefisNavbar } from '@components/ui/defis/DefisNavbar';
import { DuelFriendRow } from '@components/ui/defis/DuelFriendRow';
import { DuelIncomingModal } from '@components/ui/defis/DuelIncomingModal';
import { DuelSentModal } from '@components/ui/defis/DuelSentModal';
import { DuelViewAllLink } from '@components/ui/defis/DuelViewAllLink';
import { RecentDuelRow } from '@components/ui/defis/RecentDuelRow';
import { SectionTitle } from '@components/ui/defis/SectionTitle';
import {
  DUEL_HUB_FRIENDS_PREVIEW,
  DUEL_HUB_PENDING_PREVIEW,
  DUEL_HUB_RECENT_PREVIEW,
} from '@constants/duelList';
import { DefisRoutes } from '@constants/defisRoutes';
import { useAuthMe } from '@hooks/useAuthMe';
import { useNetworkStatus } from '@hooks/useNetworkStatus';
import { notifyUser } from '@platform/notify';
import { useAppError } from '@providers/AppErrorProvider';
import type { DuelSummary } from '@app-types/challenge.types';
import {
  createFriendDuel,
  fetchPendingDuelsForUser,
  fetchRecentDuelsForUser,
  respondToDuel,
} from '@services/defis/duelRepository';
import { fetchFriendsForDuelPaginated } from '@services/defis/duelFriendsSearch';
import { openDuelFromList } from '@utils/defis/openDuelFromList';

export function DuelHubPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showAppError } = useAppError();
  const { data: me } = useAuthMe();
  const userId = me?.user?.id ?? '';
  const { isOnline } = useNetworkStatus();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sentModal, setSentModal] = useState<{
    duel: DuelSummary;
    friendName: string;
  } | null>(null);
  const [incomingDuel, setIncomingDuel] = useState<DuelSummary | null>(null);
  const [respondingDuelId, setRespondingDuelId] = useState<string | null>(null);
  const shownIncomingIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const { data: pendingPage, isLoading: loadingPending } = useQuery({
    queryKey: ['duels-pending', userId],
    queryFn: () =>
      fetchPendingDuelsForUser(userId, { page: 1, limit: DUEL_HUB_PENDING_PREVIEW }),
    enabled: Boolean(userId),
  });

  const { data: recentPage, isLoading: loadingRecent } = useQuery({
    queryKey: ['duels-recent', userId],
    queryFn: () =>
      fetchRecentDuelsForUser(userId, { page: 1, limit: DUEL_HUB_RECENT_PREVIEW }),
    enabled: Boolean(userId),
  });

  const {
    data: friendsPage,
    isLoading: loadingFriends,
    isError: friendsError,
    refetch: refetchFriends,
  } = useQuery({
    queryKey: ['duel-friends-search', debouncedSearch.trim()],
    queryFn: () => fetchFriendsForDuelPaginated(debouncedSearch, 1, DUEL_HUB_FRIENDS_PREVIEW),
    enabled: Boolean(userId),
  });

  const pendingItems = pendingPage?.items ?? [];
  const pendingTotal = pendingPage?.total ?? 0;
  const recentItems = recentPage?.items ?? [];
  const recentTotal = recentPage?.total ?? 0;
  const friendItems = friendsPage?.items ?? [];
  const friendsTotal = friendsPage?.total ?? 0;

  useEffect(() => {
    if (!friendsError) return;
    showAppError('Impossible de charger la liste de vos amis. Vérifiez votre connexion.', {
      title: 'Amis',
      onRetry: () => void refetchFriends(),
    });
  }, [friendsError, refetchFriends, showAppError]);

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['duels-pending'] });
    await queryClient.invalidateQueries({ queryKey: ['duels-recent'] });
  };

  useEffect(() => {
    if (!userId) return;

    const refreshOnFocus = () => {
      if (document.visibilityState === 'hidden') return;
      void queryClient.invalidateQueries({ queryKey: ['duels-pending', userId] });
      void queryClient.invalidateQueries({ queryKey: ['duels-recent', userId] });
    };

    refreshOnFocus();
    window.addEventListener('focus', refreshOnFocus);
    document.addEventListener('visibilitychange', refreshOnFocus);
    return () => {
      window.removeEventListener('focus', refreshOnFocus);
      document.removeEventListener('visibilitychange', refreshOnFocus);
    };
  }, [queryClient, userId]);

  useEffect(() => {
    if (!pendingItems.length || !userId) return;
    const nextIncoming = pendingItems.find(
      (duel) => duel.phase === 'needs_your_acceptance' && !shownIncomingIds.current.has(duel.id),
    );
    if (nextIncoming) {
      shownIncomingIds.current.add(nextIncoming.id);
      setIncomingDuel(nextIncoming);
    }
  }, [pendingItems, userId]);

  const onQuickDuel = () => {
    notifyUser('Duel rapide', "Recherche d'un adversaire aléatoire — bientôt disponible.");
  };

  const onChallengeFriend = async (friendName: string, friendId: string) => {
    if (!userId) return;
    try {
      const result = await createFriendDuel(userId, friendId);
      await refresh();
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

  const onIncomingAccept = async () => {
    if (!incomingDuel || !userId) return;
    const duelId = incomingDuel.id;
    setIncomingDuel(null);
    setRespondingDuelId(duelId);
    try {
      const result = await respondToDuel(duelId, userId, true);
      await refresh();
      if (result.queued) {
        notifyUser('Duel', 'Acceptation enregistrée — le duel sera disponible à la reconnexion.');
        return;
      }
      navigate(DefisRoutes.duelDetail(duelId));
    } catch (error) {
      showAppError(error instanceof Error ? error.message : "Impossible d'accepter le duel.", {
        title: 'Duel',
      });
    } finally {
      setRespondingDuelId(null);
    }
  };

  const onIncomingDecline = async () => {
    if (!incomingDuel || !userId) return;
    const duelId = incomingDuel.id;
    setIncomingDuel(null);
    setRespondingDuelId(duelId);
    try {
      const result = await respondToDuel(duelId, userId, false);
      await refresh();
      if (result.queued) {
        notifyUser('Duel', 'Refus enregistré — synchronisation à la reconnexion.');
      }
    } catch (error) {
      showAppError(error instanceof Error ? error.message : 'Impossible de refuser le duel.', {
        title: 'Duel',
      });
    } finally {
      setRespondingDuelId(null);
    }
  };

  const onRespond = async (duelId: string, accept: boolean, challengerName: string) => {
    if (!userId || respondingDuelId) return;
    setRespondingDuelId(duelId);
    try {
      const result = await respondToDuel(duelId, userId, accept);
      await refresh();
      if (result.queued) {
        notifyUser(
          'Duel',
          accept
            ? 'Acceptation enregistrée — le duel sera disponible à la reconnexion.'
            : 'Refus enregistré — synchronisation à la reconnexion.',
        );
        return;
      }
      if (accept) {
        notifyUser('Défi accepté', `Le duel contre ${challengerName} est lancé. Bonne chance !`);
        navigate(DefisRoutes.duelDetail(duelId));
      } else {
        notifyUser('Défi refusé', `${challengerName} sera notifié de votre refus.`);
      }
    } catch (error) {
      showAppError(error instanceof Error ? error.message : 'Une erreur est survenue.', {
        title: 'Duel',
        onRetry: () => void onRespond(duelId, accept, challengerName),
      });
    } finally {
      setRespondingDuelId(null);
    }
  };

  const onBack = useCallback(() => navigate(DefisRoutes.hub), [navigate]);

  return (
    <div className="defis-page defis-page--shell duel-hub-page">
      <DefisNavbar title="Duel" onBack={onBack} />

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

      <DuelIncomingModal
        open={incomingDuel !== null}
        challengerName={incomingDuel?.challengerName ?? ''}
        questionsCount={incomingDuel?.questionsCount ?? 15}
        expiresAt={incomingDuel?.expiresAt ?? new Date().toISOString()}
        busy={respondingDuelId === incomingDuel?.id}
        onAccept={() => void onIncomingAccept()}
        onDecline={() => void onIncomingDecline()}
        onClose={() => setIncomingDuel(null)}
      />

      <button type="button" className="duel-hero-card" onClick={onQuickDuel}>
        <span className="duel-hero-eyebrow">⚡ Duel rapide</span>
        <strong className="duel-hero-title">Affrontez un adversaire aléatoire maintenant !</strong>
        <span className="duel-hero-meta">15 questions · ~3 min</span>
        <span className="duel-hero-cta">Jouer maintenant →</span>
      </button>

      {!isOnline && (pendingTotal > 0 || recentTotal > 0) ? (
        <p className="duel-hub-offline">Données en cache — reconnectez-vous pour actualiser.</p>
      ) : null}

      <div className="duel-hub-board">
        <section className="duel-hub-section duel-hub-section--pending">
          <SectionTitle
            title={pendingTotal > 0 ? `Duels en attente (${pendingTotal})` : 'Duels en attente'}
          />
          {loadingPending ? (
            <div className="duel-hub-loader" role="status" aria-label="Chargement">
              <div className="defis-spinner is-primary" />
            </div>
          ) : null}
          {pendingTotal === 0 && !loadingPending ? (
            <p className="duel-hub-empty">Aucun duel en attente.</p>
          ) : null}
          <div className="duel-hub-list">
            {pendingItems.map((duel) => (
              <ActiveDuelCard
                key={duel.id}
                duel={duel}
                userId={userId}
                busy={respondingDuelId === duel.id}
                onRespond={onRespond}
                onOpen={() => navigate(DefisRoutes.duelDetail(duel.id))}
              />
            ))}
          </div>
          <DuelViewAllLink
            totalCount={pendingTotal}
            visibleCount={DUEL_HUB_PENDING_PREVIEW}
            onPress={() => navigate(DefisRoutes.duelPendingList)}
          />
        </section>

        <section className="duel-hub-section duel-hub-section--recent">
          <SectionTitle
            title={recentTotal > 0 ? `Mes duels récents (${recentTotal})` : 'Mes duels récents'}
          />
          {loadingRecent ? (
            <div className="duel-hub-loader" role="status" aria-label="Chargement">
              <div className="defis-spinner is-primary" />
            </div>
          ) : null}
          {recentTotal === 0 && !loadingRecent ? (
            <p className="duel-hub-empty">Aucun duel terminé pour le moment.</p>
          ) : null}
          {recentTotal > 0 ? (
            <div className="duel-hub-list">
              {recentItems.map((duel) => (
                <RecentDuelRow
                  key={duel.id}
                  duel={duel}
                  userId={userId}
                  onPress={() => openDuelFromList(navigate, queryClient, duel)}
                />
              ))}
            </div>
          ) : null}
          <DuelViewAllLink
            totalCount={recentTotal}
            visibleCount={DUEL_HUB_RECENT_PREVIEW}
            onPress={() => navigate(DefisRoutes.duelRecentList)}
          />
        </section>

        <section className="duel-hub-section duel-hub-section--friends">
          <SectionTitle
            title={friendsTotal > 0 ? `Défier un ami (${friendsTotal})` : 'Défier un ami'}
          />
          <input
            className="duel-hub-search"
            placeholder="🔍 Rechercher un ami..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            autoCapitalize="none"
            autoCorrect="off"
          />
          {loadingFriends ? (
            <div className="duel-hub-loader" role="status" aria-label="Chargement">
              <div className="defis-spinner is-primary" />
            </div>
          ) : null}
          {!loadingFriends && friendItems.length === 0 ? (
            <p className="duel-hub-empty">
              {search.trim()
                ? 'Aucun ami trouvé pour cette recherche.'
                : 'Aucun ami dans votre réseau.'}
            </p>
          ) : null}
          {!loadingFriends && friendsTotal > DUEL_HUB_FRIENDS_PREVIEW ? (
            <p className="duel-hub-hint">
              {search.trim()
                ? `${friendsTotal} résultat${friendsTotal > 1 ? 's' : ''} · affichage limité`
                : `${friendsTotal} amis · utilisez la recherche pour filtrer`}
            </p>
          ) : null}
          <div className="duel-hub-friends-grid">
            {friendItems.map((friend) => (
              <DuelFriendRow
                key={friend.id}
                friend={friend}
                onChallenge={() => void onChallengeFriend(friend.displayName, friend.id)}
              />
            ))}
          </div>
          <DuelViewAllLink
            totalCount={friendsTotal}
            visibleCount={DUEL_HUB_FRIENDS_PREVIEW}
            onPress={() => navigate(DefisRoutes.duelFriendsList)}
          />
        </section>
      </div>
    </div>
  );
}
