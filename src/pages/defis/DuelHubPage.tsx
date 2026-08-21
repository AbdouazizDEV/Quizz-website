import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DefisRoutes } from '@constants/defisRoutes';
import { buildQuizEntryHref } from '@constants/Routes';
import { useAuthMe } from '@hooks/useAuthMe';
import { useDuelQuery } from '@hooks/defis/useDuelQuery';
import {
  createFriendDuel,
  fetchPendingDuelsForUser,
  fetchRecentDuelsForUser,
  respondToDuel,
} from '@services/defis/duelRepository';
import { fetchFriendsForDuelPaginated } from '@services/defis/duelFriendsSearch';
import { openDuelFromList } from '@utils/defis/openDuelFromList';
import { Icon } from '@components/ui/Icon';

export function DuelHubPage() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <h1>Duels</h1>
      <Link to={DefisRoutes.duelFriendsList} className="card" style={{ padding: 16, display: 'block' }}>Défier un ami</Link>
      <Link to={DefisRoutes.duelPendingList} className="card" style={{ padding: 16, display: 'block' }}>En attente</Link>
      <Link to={DefisRoutes.duelRecentList} className="card" style={{ padding: 16, display: 'block' }}>Récents</Link>
    </div>
  );
}

export function DuelFriendsPage() {
  const { data: me } = useAuthMe();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['duel-friends'],
    queryFn: () => fetchFriendsForDuelPaginated('', 1, 30),
    enabled: Boolean(me?.user?.id),
  });

  return (
    <div>
      <h1>Défier un ami</h1>
      {isLoading ? <p>Chargement…</p> : null}
      {(data?.items ?? []).map((friend) => (
        <button
          key={friend.id}
          type="button"
          className="card"
          style={{ padding: 14, width: '100%', textAlign: 'left', marginBottom: 8, background: '#fff' }}
          onClick={async () => {
            const result = await createFriendDuel(me?.user?.id ?? '', friend.id);
            if (result.data?.id) navigate(DefisRoutes.duelDetail(result.data.id));
          }}
        >
          {friend.displayName}
        </button>
      ))}
    </div>
  );
}

export function DuelPendingPage() {
  const { data: me } = useAuthMe();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['duels-pending-list'],
    queryFn: () => fetchPendingDuelsForUser(me!.user.id, { page: 1, limit: 30 }),
    enabled: Boolean(me?.user?.id),
  });

  return (
    <div>
      <h1>Duels en attente</h1>
      {isLoading ? <p>Chargement…</p> : null}
      {(data?.items ?? []).map((duel) => (
        <button
          key={duel.id}
          type="button"
          className="card"
          style={{ padding: 14, width: '100%', textAlign: 'left', marginBottom: 8, background: '#fff' }}
          onClick={() => openDuelFromList(navigate, queryClient, duel)}
        >
          {duel.challengerName} vs {duel.challengedName}
        </button>
      ))}
    </div>
  );
}

export function DuelRecentPage() {
  const { data: me } = useAuthMe();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['duels-recent-list'],
    queryFn: () => fetchRecentDuelsForUser(me!.user.id, { page: 1, limit: 30 }),
    enabled: Boolean(me?.user?.id),
  });

  return (
    <div>
      <h1>Duels récents</h1>
      {isLoading ? <p>Chargement…</p> : null}
      {(data?.items ?? []).map((duel) => (
        <button
          key={duel.id}
          type="button"
          className="card"
          style={{ padding: 14, width: '100%', textAlign: 'left', marginBottom: 8, background: '#fff' }}
          onClick={() => openDuelFromList(navigate, queryClient, duel)}
        >
          {duel.challengerName} vs {duel.challengedName} · {duel.status}
        </button>
      ))}
    </div>
  );
}

export function DuelDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useDuelQuery(id ?? '');
  const { data: me } = useAuthMe();

  if (isLoading) return <p>Chargement…</p>;
  if (error || !data) return <p className="error-text">Duel introuvable.</p>;

  return (
    <div>
      <h1>Duel</h1>
      <p>{data.challengerName} vs {data.challengedName}</p>
      <p className="muted">Statut : {data.status} · phase {data.phase}</p>
      {data.phase === 'needs_your_acceptance' ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="btn btn-primary" onClick={() => void respondToDuel(data.id, me?.user?.id ?? '', true)}>Accepter</button>
          <button type="button" className="btn btn-ghost" onClick={() => void respondToDuel(data.id, me?.user?.id ?? '', false)}>Refuser</button>
        </div>
      ) : null}
      {data.phase === 'your_turn' ? (
        <button type="button" className="btn btn-primary" onClick={() => navigate(buildQuizEntryHref(data.quizId, { duelId: data.id }))}>
          Jouer
        </button>
      ) : null}
      {me ? <p className="muted">Toi : {me.profile?.username}</p> : null}
    </div>
  );
}

export function DuelResultPage() {
  const { id } = useParams();
  const { data } = useDuelQuery(id ?? '');
  return (
    <div>
      <h1>Résultat du duel</h1>
      <p>{data?.challengerName} {data?.challengerScore ?? '—'} — {data?.challengedScore ?? '—'} {data?.challengedName}</p>
      <Link to={DefisRoutes.duelHub} className="btn btn-ghost" style={{ display: 'inline-flex', marginTop: 16 }}>
        <Icon name="chevron-left" /> Retour
      </Link>
    </div>
  );
}
