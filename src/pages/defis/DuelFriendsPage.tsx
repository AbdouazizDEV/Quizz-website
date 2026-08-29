import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { DefisNavbar } from '@components/ui/defis/DefisNavbar';
import { DefisStateViews } from '@components/ui/defis/DefisStateViews';
import { DuelSentModal } from '@components/ui/defis/DuelSentModal';
import { DefisRoutes } from '@constants/defisRoutes';
import { useAuthMe } from '@hooks/useAuthMe';
import { useAppError } from '@providers/AppErrorProvider';
import { createFriendDuel } from '@services/defis/duelRepository';
import { fetchFriendsForDuelPaginated } from '@services/defis/duelFriendsSearch';
import { getUserAvatarUri } from '@utils/getUserAvatarUri';

export function DuelFriendsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: me } = useAuthMe();
  const { showAppError } = useAppError();
  const [query, setQuery] = useState('');
  const [sentName, setSentName] = useState<string | null>(null);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['duel-friends', query],
    queryFn: () => fetchFriendsForDuelPaginated(query, 1, 30),
    enabled: Boolean(me?.user?.id),
  });

  return (
    <div className="defis-page">
      <DefisNavbar title="Amis" onBack={() => navigate(DefisRoutes.duelHub)} />
      <input
        className="defis-search"
        placeholder="Rechercher un ami"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      {isLoading ? <DefisStateViews loading /> : null}
      {error ? (
        <DefisStateViews
          error={error instanceof Error ? error : 'Impossible de charger les amis.'}
          onRetry={() => void refetch()}
        />
      ) : null}
      <div className="defis-cards is-grid">
        {(data?.items ?? []).map((friend) => (
          <button
            key={friend.id}
            type="button"
            className="defis-card"
            onClick={async () => {
              try {
                await createFriendDuel(me?.user?.id ?? '', friend.id);
                await queryClient.invalidateQueries({ queryKey: ['duels-pending'] });
                setSentName(friend.displayName);
              } catch (err) {
                showAppError(err instanceof Error ? err.message : 'Impossible de créer le duel.', {
                  title: 'Duel',
                });
              }
            }}
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
      <DuelSentModal open={Boolean(sentName)} opponentName={sentName ?? ''} onClose={() => setSentName(null)} />
    </div>
  );
}
