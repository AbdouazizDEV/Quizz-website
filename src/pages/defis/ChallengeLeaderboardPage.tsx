import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { ChallengeCompetitionHero } from '@components/ui/defis/ChallengeCompetitionHero';
import { ChallengeMyRankCard } from '@components/ui/defis/ChallengeMyRankCard';
import { ChallengePodium } from '@components/ui/defis/ChallengePodium';
import { DefisNavbar } from '@components/ui/defis/DefisNavbar';
import { DefisStateViews } from '@components/ui/defis/DefisStateViews';
import { DefisRoutes } from '@constants/defisRoutes';
import { useAuthMe } from '@hooks/useAuthMe';
import { useChallenge } from '@hooks/defis/useChallenge';
import { fetchChallengeLeaderboard } from '@services/defis/challengeRepository';

export function ChallengeLeaderboardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: me } = useAuthMe();
  const { data: progress } = useChallenge(id, me?.user?.id);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['challenge-leaderboard', id, me?.user?.id],
    queryFn: () => fetchChallengeLeaderboard(id!, me!.user.id),
    enabled: Boolean(id && me?.user?.id),
  });

  const onBack = useCallback(() => {
    if (id) navigate(DefisRoutes.challengeDetail(id));
    else navigate(DefisRoutes.challengeList);
  }, [id, navigate]);

  const rest = (data?.entries ?? []).filter((row) => row.rank > 3);

  return (
    <div className="defis-page">
      <DefisNavbar title="Classement" onBack={onBack} />
      {progress ? <ChallengeCompetitionHero progress={progress} /> : null}
      {isLoading ? <DefisStateViews loading /> : null}
      {error ? (
        <DefisStateViews
          error={error instanceof Error ? error : 'Impossible de charger le classement.'}
          onRetry={() => void refetch()}
        />
      ) : null}
      {data && (data.entries.length === 0) ? (
        <DefisStateViews empty="Aucun score pour l'instant — soyez le premier..." />
      ) : null}
      {data && data.entries.length > 0 ? (
        <>
          <ChallengeMyRankCard
            rank={data.currentUser?.rank ?? null}
            score={data.currentUser?.totalScore ?? 0}
            pointsToNext={data.currentUser?.pointsToNextRank ?? null}
          />
          <ChallengePodium entries={data.entries} />
          <div className="defis-cards">
            {rest.map((row) => (
              <div key={row.userId} className={row.isCurrentUser ? 'defis-row is-me' : 'defis-row'}>
                <span>
                  #{row.rank} {row.displayName}
                </span>
                <strong>{row.totalScore} pts</strong>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
