import { useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { ChallengeCompetitionHero } from '@components/ui/defis/ChallengeCompetitionHero';
import { ChallengeMissionRow } from '@components/ui/defis/ChallengeMissionRow';
import { DefisNavbar } from '@components/ui/defis/DefisNavbar';
import { DefisStateViews } from '@components/ui/defis/DefisStateViews';
import { DefisRoutes } from '@constants/defisRoutes';
import { buildQuizEntryHref } from '@constants/Routes';
import { useAuthMe } from '@hooks/useAuthMe';
import { useChallenge } from '@hooks/defis/useChallenge';
import { useNetworkStatus } from '@hooks/useNetworkStatus';
import { useAppError } from '@providers/AppErrorProvider';
import { assertCanParticipateInChallengeQuiz } from '@services/defis/participateChallenge.service';

export function ChallengeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: me } = useAuthMe();
  const { data, isLoading, error, refetch } = useChallenge(id, me?.user?.id);
  const { isOnline } = useNetworkStatus();
  const { showAppError } = useAppError();

  const onBack = useCallback(() => navigate(DefisRoutes.challengeList), [navigate]);

  const playQuiz = useCallback(
    async (quizId: string, scheduledDay: string) => {
      if (!id || !me?.user?.id) return;
      try {
        await assertCanParticipateInChallengeQuiz(me.user.id, id, quizId, scheduledDay);
        navigate(buildQuizEntryHref(quizId, { challengeId: id }));
      } catch (err) {
        showAppError(err instanceof Error ? err.message : 'Impossible de lancer ce quiz.', {
          title: 'Challenge',
        });
      }
    },
    [id, me?.user?.id, navigate, showAppError],
  );

  return (
    <div className="defis-page challenge-detail-page">
      <DefisNavbar title="Challenge" onBack={onBack} />
      {!isOnline ? (
        <p className="defis-muted">Hors ligne — affichage depuis le cache local si disponible.</p>
      ) : null}
      {isLoading ? <DefisStateViews loading /> : null}
      {error ? (
        <DefisStateViews
          error={error instanceof Error ? error : 'Impossible de charger ce challenge.'}
          onRetry={() => void refetch()}
        />
      ) : null}
      {data ? (
        <div className="challenge-detail-board">
          <div className="challenge-detail-hero-col">
            <ChallengeCompetitionHero progress={data} />
            {id ? (
              <Link to={DefisRoutes.challengeLeaderboard(id)} className="defis-cta defis-cta-navy">
                Voir le classement
              </Link>
            ) : null}
          </div>
          <section className="challenge-detail-missions">
            <h2 className="home-section-title">Missions quiz</h2>
            <div className="defis-cards">
              {data.dailyQuizzes.map((quiz) => (
                <ChallengeMissionRow
                  key={quiz.quizId}
                  quiz={quiz}
                  onPress={() => void playQuiz(quiz.quizId, quiz.scheduledDay)}
                />
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
