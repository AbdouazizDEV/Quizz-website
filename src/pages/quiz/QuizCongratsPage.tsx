import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { DefisRoutes } from '@constants/defisRoutes';
import { Routes } from '@constants/Routes';
import { pointsForDifficulty } from '@domain/quiz/difficultyPoints';
import { getQuizLeaderboardPort } from '@services/quiz/leaderboard/quizLeaderboardInstance';
import { triggerQuizCongratsSound } from '@services/quiz/play/triggerQuizCongratsSound';
import { getQuizScoreSharePort } from '@services/quiz/share/quizScoreShareInstance';
import { useQuizPlaySessionStore } from '@stores/quizPlaySessionStore';
import { QUIZ_SHARE_CAPTURE_ID } from '@services/quiz/share/quizShareCaptureConstants';
import type { QuizLeaderboardEntry } from '@app-types/quizPlay.types';
import { Icon } from '@components/ui/Icon';

export function QuizCongratsPage() {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [params] = useSearchParams();
  const duelId = params.get('duelId');
  const challengeId = params.get('challengeId');
  const payload = useQuizPlaySessionStore((s) => s.payload);
  const answers = useQuizPlaySessionStore((s) => s.answers);
  const sessionPoints = useQuizPlaySessionStore((s) => s.sessionPoints);
  const categorySlug = useQuizPlaySessionStore((s) => s.categorySlug);
  const reset = useQuizPlaySessionStore((s) => s.reset);
  const [leaderboard, setLeaderboard] = useState<QuizLeaderboardEntry[]>([]);

  const correctCount = answers.filter((a) => a.isCorrect).length;
  const total = payload?.questions.length ?? answers.length;
  const maxPoints = payload?.questions.reduce((sum, q) => sum + pointsForDifficulty(q.difficulty), 0) ?? 0;

  useEffect(() => {
    void triggerQuizCongratsSound(correctCount, total);
  }, [correctCount, total]);

  useEffect(() => {
    if (!quizId) return;
    void getQuizLeaderboardPort()
      .fetchLeaderboardForQuiz(quizId)
      .then(setLeaderboard)
      .catch(() => setLeaderboard([]));
  }, [quizId]);

  const title = useMemo(() => {
    if (total > 0 && correctCount >= total) return 'Parfait !';
    if (correctCount > total / 2) return 'Belle performance';
    return 'Continue comme ça';
  }, [correctCount, total]);

  return (
    <div className="quiz-congrats-page">
      <div id={QUIZ_SHARE_CAPTURE_ID} className="quiz-congrats-card">
        <div>
          <h1 style={{ marginTop: 0 }}>{title}</h1>
          <p className="muted">{payload?.quiz.title}</p>
          <div className="quiz-congrats-score">{sessionPoints} pts</div>
          <p style={{ fontWeight: 700 }}>
            {correctCount}/{total} bonnes réponses · max {maxPoints}
          </p>
        </div>
        <div>
          <p style={{ fontWeight: 800, margin: '0 0 10px' }}>Classement</p>
          <div className="quiz-congrats-lb">
            {leaderboard.slice(0, 5).map((row) => (
              <div key={row.userId} className="quiz-congrats-lb-row">
                <span>
                  #{row.rank} {row.displayName}
                </span>
                <span>{row.score}</span>
              </div>
            ))}
            {leaderboard.length === 0 ? <p className="muted">Aucun classement pour le moment.</p> : null}
          </div>
        </div>
        <div className="quiz-congrats-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              void getQuizScoreSharePort().shareScore({
                quizTitle: payload?.quiz.title ?? 'Quiz',
                score: sessionPoints,
                correctCount,
                total,
              });
            }}
          >
            <Icon name="share-2" /> Partager
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              reset();
              if (duelId) navigate(DefisRoutes.duelResult(duelId));
              else if (challengeId) navigate(DefisRoutes.challengeDetail(challengeId));
              else if (categorySlug) navigate(`${Routes.CATEGORIES}/${categorySlug}`);
              else navigate(Routes.HOME);
            }}
          >
            Terminer
          </button>
        </div>
      </div>
    </div>
  );
}
