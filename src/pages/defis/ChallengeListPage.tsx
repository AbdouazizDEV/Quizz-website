import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { DefisRoutes } from '@constants/defisRoutes';
import { buildQuizEntryHref } from '@constants/Routes';
import { useAuthMe } from '@hooks/useAuthMe';
import { useChallenge } from '@hooks/defis/useChallenge';
import { fetchActiveWeeklyChallenges, fetchChallengeLeaderboard } from '@services/defis/challengeRepository';
import { Icon } from '@components/ui/Icon';

export function ChallengeListPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['weekly-challenges'],
    queryFn: fetchActiveWeeklyChallenges,
  });

  return (
    <div>
      <h1>Challenges hebdo</h1>
      {isLoading ? <p>Chargement…</p> : null}
      {error ? <p className="error-text">{error instanceof Error ? error.message : 'Impossible de charger les challenges.'}</p> : null}
      <div style={{ display: 'grid', gap: 12 }}>
        {(data ?? []).map((item) => (
          <Link key={item.id} to={DefisRoutes.challengeDetail(item.id)} className="card" style={{ padding: 16, display: 'block' }}>
            <strong>{item.title}</strong>
            <div className="muted">{item.rewardText ?? 'Gagne des points'}</div>
          </Link>
        ))}
        {!isLoading && (data?.length ?? 0) === 0 ? <p className="muted">Aucun challenge actif.</p> : null}
      </div>
    </div>
  );
}

export function ChallengeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: me } = useAuthMe();
  const { data, isLoading, error } = useChallenge(id, me?.user?.id);

  return (
    <div>
      <button type="button" className="btn btn-ghost" onClick={() => navigate(DefisRoutes.challengeList)}>
        <Icon name="chevron-left" /> Challenges
      </button>
      <h1>{data?.challenge.title ?? 'Challenge'}</h1>
      {isLoading ? <p>Chargement…</p> : null}
      {error ? <p className="error-text">{error instanceof Error ? error.message : 'Erreur'}</p> : null}
      <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
        {(data?.dailyQuizzes ?? []).map((quiz) => (
          <button
            key={quiz.quizId}
            type="button"
            className="card"
            style={{ padding: 16, textAlign: 'left', background: '#fff' }}
            onClick={() => navigate(buildQuizEntryHref(quiz.quizId, { challengeId: id }))}
          >
            <strong>{quiz.title}</strong>
            <div className="muted">{quiz.isPlayed ? 'Terminé' : 'À jouer'}</div>
          </button>
        ))}
      </div>
      {id ? (
        <Link to={DefisRoutes.challengeLeaderboard(id)} className="btn btn-ghost" style={{ marginTop: 16, display: 'inline-flex' }}>
          Classement
        </Link>
      ) : null}
    </div>
  );
}

export function ChallengeLeaderboardPage() {
  const { id } = useParams();
  const { data: me } = useAuthMe();
  const { data, isLoading } = useQuery({
    queryKey: ['challenge-leaderboard', id, me?.user?.id],
    queryFn: () => fetchChallengeLeaderboard(id!, me!.user.id),
    enabled: Boolean(id && me?.user?.id),
  });

  return (
    <div>
      <h1>Classement challenge</h1>
      {isLoading ? <p>Chargement…</p> : null}
      {(data?.entries ?? []).map((row) => (
        <div key={row.userId} className="card" style={{ padding: 12, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
          <span>#{row.rank} {row.displayName}</span>
          <strong>{row.totalScore} pts</strong>
        </div>
      ))}
    </div>
  );
}
