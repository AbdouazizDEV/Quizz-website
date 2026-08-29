import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { DefisNavbar } from '@components/ui/defis/DefisNavbar';
import { DefisStateViews } from '@components/ui/defis/DefisStateViews';
import { DuelIncomingModal } from '@components/ui/defis/DuelIncomingModal';
import { DuelListCard } from '@components/ui/defis/DuelListCard';
import { DuelSentModal } from '@components/ui/defis/DuelSentModal';
import { DefisRoutes } from '@constants/defisRoutes';
import { useAuthMe } from '@hooks/useAuthMe';
import { useAppError } from '@providers/AppErrorProvider';
import { createFriendDuel, fetchPendingDuelsForUser, fetchRecentDuelsForUser, respondToDuel } from '@services/defis/duelRepository';
import { searchFriendsForDuel } from '@services/defis/duelFriendsSearch';
import { openDuelFromList } from '@utils/defis/openDuelFromList';
import { getUserAvatarUri } from '@utils/getUserAvatarUri';

export function DuelHubPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: me } = useAuthMe();
  const userId = me?.user?.id ?? '';
  const { showAppError } = useAppError();
  const [query, setQuery] = useState('');
  const [sentName, setSentName] = useState<string | null>(null);
  const [incomingId, setIncomingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const pendingQuery = useQuery({
    queryKey: ['duels-pending', userId],
    queryFn: () => fetchPendingDuelsForUser(userId, { page: 1, limit: 5 }),
    enabled: Boolean(userId),
  });
  const recentQuery = useQuery({
    queryKey: ['duels-recent', userId],
    queryFn: () => fetchRecentDuelsForUser(userId, { page: 1, limit: 5 }),
    enabled: Boolean(userId),
  });
  const friendsQuery = useQuery({
    queryKey: ['duel-friends-hub', query],
    queryFn: () => searchFriendsForDuel(query, 8),
    enabled: Boolean(userId),
  });

  const incoming = useMemo(
    () => pendingQuery.data?.items.find((d) => d.phase === 'needs_your_acceptance') ?? null,
    [pendingQuery.data],
  );

  const onBack = useCallback(() => navigate(DefisRoutes.hub), [navigate]);

  const challengeFriend = async (friendId: string, name: string) => {
    try {
      const result = await createFriendDuel(userId, friendId);
      if (result.queued) {
        setSentName(name);
        return;
      }
      if (result.data?.id) {
        setSentName(name);
        await queryClient.invalidateQueries({ queryKey: ['duels-pending'] });
      }
    } catch (error) {
      showAppError(error instanceof Error ? error.message : 'Impossible de créer le duel.', {
        title: 'Duel',
      });
    }
  };

  const incomingDuel = incomingId
    ? pendingQuery.data?.items.find((d) => d.id === incomingId) ?? incoming
    : incoming;

  return (
    <div className="defis-page">
      <DefisNavbar title="Duel" onBack={onBack} />

      <section>
        <div className="defis-section-head">
          <h2>Duels en attente</h2>
          <button type="button" className="defis-link" onClick={() => navigate(DefisRoutes.duelPendingList)}>
            Voir tout
          </button>
        </div>
        {pendingQuery.isLoading ? <DefisStateViews loading /> : null}
        {pendingQuery.error ? (
          <DefisStateViews
            error={pendingQuery.error instanceof Error ? pendingQuery.error : 'Impossible de charger les duels.'}
            onRetry={() => void pendingQuery.refetch()}
          />
        ) : null}
        <div className="defis-cards">
          {(pendingQuery.data?.items ?? []).slice(0, 3).map((duel) => (
            <DuelListCard
              key={duel.id}
              duel={duel}
              userId={userId}
              onPress={() => {
                if (duel.phase === 'needs_your_acceptance') setIncomingId(duel.id);
                else openDuelFromList(navigate, queryClient, duel);
              }}
            />
          ))}
        </div>
        {!pendingQuery.isLoading && (pendingQuery.data?.items.length ?? 0) === 0 ? (
          <p className="defis-muted">Aucun duel en attente.</p>
        ) : null}
      </section>

      <section>
        <div className="defis-section-head">
          <h2>Mes duels récents</h2>
          <button type="button" className="defis-link" onClick={() => navigate(DefisRoutes.duelRecentList)}>
            Voir tout
          </button>
        </div>
        <div className="defis-cards">
          {(recentQuery.data?.items ?? []).slice(0, 3).map((duel) => (
            <DuelListCard
              key={duel.id}
              duel={duel}
              userId={userId}
              onPress={() => openDuelFromList(navigate, queryClient, duel)}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="defis-section-head">
          <h2>Défier un ami</h2>
          <button type="button" className="defis-link" onClick={() => navigate(DefisRoutes.duelFriendsList)}>
            Voir tout
          </button>
        </div>
        <input
          className="defis-search"
          placeholder="Rechercher un ami"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="defis-cards" style={{ marginTop: 12 }}>
          {(friendsQuery.data ?? []).map((friend) => (
            <button
              key={friend.id}
              type="button"
              className="defis-card"
              onClick={() => void challengeFriend(friend.id, friend.displayName)}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <span className="defis-avatar" style={{ width: 44, height: 44, margin: 0 }}>
                  <img src={getUserAvatarUri(friend.id, friend.avatarUri)} alt="" />
                </span>
                <span>
                  <strong>{friend.displayName}</strong>
                  <p className="defis-muted">{friend.handle}</p>
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <DuelSentModal open={Boolean(sentName)} opponentName={sentName ?? ''} onClose={() => setSentName(null)} />
      <DuelIncomingModal
        open={Boolean(incomingId && incomingDuel)}
        challengerName={incomingDuel?.challengerName ?? ''}
        busy={busy}
        onClose={() => setIncomingId(null)}
        onAccept={async () => {
          if (!incomingDuel) return;
          setBusy(true);
          try {
            const result = await respondToDuel(incomingDuel.id, userId, true);
            await queryClient.invalidateQueries({ queryKey: ['duels-pending'] });
            setIncomingId(null);
            if (result.data?.quizId) navigate(DefisRoutes.duelDetail(incomingDuel.id));
          } catch (error) {
            showAppError(error instanceof Error ? error.message : "Impossible d'accepter.", { title: 'Duel' });
          } finally {
            setBusy(false);
          }
        }}
        onDecline={async () => {
          if (!incomingDuel) return;
          setBusy(true);
          try {
            await respondToDuel(incomingDuel.id, userId, false);
            await queryClient.invalidateQueries({ queryKey: ['duels-pending'] });
            setIncomingId(null);
          } catch (error) {
            showAppError(error instanceof Error ? error.message : 'Impossible de refuser.', { title: 'Duel' });
          } finally {
            setBusy(false);
          }
        }}
      />
    </div>
  );
}
