import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { QuizPlayNavbar } from '@components/ui/quiz/play/QuizPlayNavbar';
import { QuizQuestionHeader } from '@components/ui/quiz/play/QuizQuestionHeader';
import { QuizAnswerGrid } from '@components/ui/quiz/play/QuizAnswerGrid';
import { QuizFeedbackFunFactModal } from '@components/ui/quiz/play/QuizFeedbackFunFactModal';
import { QuizResultsProcessingModal } from '@components/ui/quiz/play/QuizResultsProcessingModal';
import { useAuthMe } from '@hooks/useAuthMe';
import { useQuestionTimer } from '@hooks/useQuestionTimer';
import { recordChallengeParticipation } from '@services/defis/participateChallenge.service';
import { submitDuelScore } from '@services/defis/duelRepository';
import { submitCompetitionMatchScore } from '@services/defis/competitionRepository';
import { invalidateAuthMeCache } from '@services/auth/authMeRepository';
import { getQuizSessionPersistence } from '@services/quiz/session/quizSessionPersistenceInstance';
import { triggerQuizCorrectFeedback } from '@services/quiz/play/triggerQuizCorrectFeedback';
import { triggerQuizWrongFeedback } from '@services/quiz/play/triggerQuizWrongFeedback';
import { pointsForDifficulty } from '@domain/quiz/difficultyPoints';
import { useQuizPlaySessionStore } from '@stores/quizPlaySessionStore';
import { useAppError } from '@providers/AppErrorProvider';
import { seedDuelQueryCache } from '@hooks/defis/useDuelQuery';
import { notifyUser } from '@platform/notify';

export function QuizPlayPage() {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [params] = useSearchParams();
  const queryClient = useQueryClient();
  const { showAppError } = useAppError();
  const { data: authMe } = useAuthMe();
  const userId = authMe?.user?.id ?? '';
  const payload = useQuizPlaySessionStore((s) => s.payload);
  const currentIndex = useQuizPlaySessionStore((s) => s.currentIndex);
  const sessionPoints = useQuizPlaySessionStore((s) => s.sessionPoints);
  const selectedOptionId = useQuizPlaySessionStore((s) => s.selectedOptionId);
  const feedbackPhase = useQuizPlaySessionStore((s) => s.feedbackPhase);
  const sessionPhase = useQuizPlaySessionStore((s) => s.sessionPhase);
  const lastPointsEarned = useQuizPlaySessionStore((s) => s.lastPointsEarned);
  const correctAnswerLabel = useQuizPlaySessionStore((s) => s.correctAnswerLabel);
  const secondsPerQuestion = useQuizPlaySessionStore((s) => s.secondsPerQuestion);
  const selectOption = useQuizPlaySessionStore((s) => s.selectOption);
  const advanceFromFeedback = useQuizPlaySessionStore((s) => s.advanceFromFeedback);
  const expireQuestion = useQuizPlaySessionStore((s) => s.expireQuestion);
  const reset = useQuizPlaySessionStore((s) => s.reset);
  const duelId = useQuizPlaySessionStore((s) => s.duelId) ?? params.get('duelId');
  const challengeId = useQuizPlaySessionStore((s) => s.challengeId) ?? params.get('challengeId');
  const competitionId =
    useQuizPlaySessionStore((s) => s.competitionId) ?? params.get('competitionId');
  const matchId = useQuizPlaySessionStore((s) => s.matchId) ?? params.get('matchId');
  const expiredForQuestionRef = useRef(false);
  const correctFeedbackKeyRef = useRef<string | null>(null);
  const wrongFeedbackKeyRef = useRef<string | null>(null);
  const submitLockRef = useRef(false);
  const [isContinueBusy, setIsContinueBusy] = useState(false);

  const question = useMemo(() => payload?.questions[currentIndex] ?? null, [payload, currentIndex]);

  const handleTimerExpire = useCallback(() => {
    if (expiredForQuestionRef.current) return;
    expiredForQuestionRef.current = true;
    const q = useQuizPlaySessionStore.getState().getCurrentQuestion();
    if (!q) return;
    expireQuestion(q.options.find((o) => o.id === q.correctOptionId)?.label ?? '—');
  }, [expireQuestion]);

  const { timeLeft, pause, resume } = useQuestionTimer({
    duration: secondsPerQuestion,
    onExpire: handleTimerExpire,
    resetKey: currentIndex,
    autoStart: feedbackPhase === 'idle' && sessionPhase === 'playing',
  });

  useEffect(() => {
    if (!payload || !quizId) {
      showAppError('Les données du quiz sont absentes ou la session a expiré.', {
        title: 'Session',
        onClose: () => navigate(-1),
      });
    }
  }, [navigate, payload, quizId, showAppError]);

  useEffect(() => {
    expiredForQuestionRef.current = false;
  }, [currentIndex]);

  useEffect(() => {
    if (feedbackPhase === 'idle' && sessionPhase === 'playing') resume();
    else pause();
  }, [feedbackPhase, sessionPhase, pause, resume]);

  useEffect(() => {
    if (feedbackPhase === 'correct') {
      const key = `${currentIndex}-correct`;
      if (correctFeedbackKeyRef.current === key) return;
      correctFeedbackKeyRef.current = key;
      void triggerQuizCorrectFeedback();
      return;
    }
    correctFeedbackKeyRef.current = null;
    if (feedbackPhase !== 'incorrect' && feedbackPhase !== 'timeout') return;
    const key = `${currentIndex}-${feedbackPhase}`;
    if (wrongFeedbackKeyRef.current === key) return;
    wrongFeedbackKeyRef.current = key;
    void triggerQuizWrongFeedback();
  }, [feedbackPhase, currentIndex]);

  const onPick = (optionId: string) => {
    const state = useQuizPlaySessionStore.getState();
    if (timeLeft <= 0 || !question || state.sessionPhase !== 'playing' || state.feedbackPhase !== 'idle') {
      return;
    }
    const isCorrect = optionId === question.correctOptionId;
    selectOption(
      optionId,
      isCorrect,
      pointsForDifficulty(question.difficulty),
      question.options.find((o) => o.id === question.correctOptionId)?.label ?? '—',
    );
  };

  const onContinueAfterFeedback = async () => {
    if (submitLockRef.current) return;
    if (!quizId || !payload) return;
    if (useQuizPlaySessionStore.getState().sessionPhase === 'submitting') return;

    const isLastQuestion = currentIndex >= payload.questions.length - 1;
    if (isLastQuestion) {
      submitLockRef.current = true;
      setIsContinueBusy(true);
    }

    const next = advanceFromFeedback();
    if (next === 'continue') {
      submitLockRef.current = false;
      setIsContinueBusy(false);
      return;
    }

    const answers = useQuizPlaySessionStore.getState().answers;
    const earned = useQuizPlaySessionStore.getState().sessionPoints;
    const res = await getQuizSessionPersistence().recordCompletedSession({
      quizId,
      earnedPoints: earned,
      answers,
    });
    if (!res.ok) {
      showAppError(res.errorMessage ?? 'Votre score n’a pas pu être enregistré.', { title: 'Enregistrement' });
    }

    if (duelId) {
      try {
        const result = await submitDuelScore(duelId, earned);
        if (result.queued) notifyUser('Duel', 'Score enregistré — sync à la reconnexion.');
        else if (result.data) {
          seedDuelQueryCache(queryClient, result.data);
        }
        await queryClient.invalidateQueries({ queryKey: ['duels-pending'] });
        await queryClient.invalidateQueries({ queryKey: ['duels-recent'] });
        await queryClient.invalidateQueries({ queryKey: ['duels-pending-list'] });
        await queryClient.invalidateQueries({ queryKey: ['duels-recent-list'] });
        await queryClient.invalidateQueries({ queryKey: ['defis-dashboard'] });
        void invalidateAuthMeCache();
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Score duel non enregistré.';
        if (!message.includes('déjà joué')) showAppError(message, { title: 'Duel' });
      }
    }

    if (challengeId && userId) {
      try {
        await recordChallengeParticipation(userId, challengeId, quizId, earned);
        await queryClient.invalidateQueries({ queryKey: ['weekly-challenges'] });
        await queryClient.invalidateQueries({ queryKey: ['challenge'] });
        await queryClient.invalidateQueries({ queryKey: ['challenge-leaderboard'] });
        await queryClient.invalidateQueries({ queryKey: ['defis-dashboard'] });
        void invalidateAuthMeCache();
      } catch (error) {
        showAppError(error instanceof Error ? error.message : 'Score challenge non enregistré.', { title: 'Challenge' });
      }
    }

    if (competitionId && quizId) {
      try {
        const result = await submitCompetitionMatchScore(competitionId, {
          score: earned,
          matchId: matchId && !matchId.startsWith('g') ? matchId : undefined,
          quizId,
        });
        if (result.waitingForOthers) {
          notifyUser('Tournoi', 'Score enregistré — en attente des autres joueurs.');
        } else if (result.tiebreak) {
          notifyUser('Tournoi', 'Égalité ! Un quiz de barrage va être proposé.');
        } else if (result.advanced) {
          notifyUser('Tournoi', 'Manche terminée — qualifiés mis à jour.');
        }
        await queryClient.invalidateQueries({ queryKey: ['competition'] });
        await queryClient.invalidateQueries({ queryKey: ['competition-bracket'] });
        await queryClient.invalidateQueries({ queryKey: ['competitions'] });
        await queryClient.invalidateQueries({ queryKey: ['defis-dashboard'] });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Score tournoi non enregistré.';
        if (!/déjà/i.test(message)) showAppError(message, { title: 'Tournoi' });
      }
    }

    const qs = new URLSearchParams();
    if (duelId) qs.set('duelId', duelId);
    if (challengeId) qs.set('challengeId', challengeId);
    if (competitionId) qs.set('competitionId', competitionId);
    if (matchId) qs.set('matchId', matchId);
    navigate(`/quiz/${quizId}/congrats${qs.toString() ? `?${qs}` : ''}`, { replace: true });
  };

  if (!payload || !question) {
    return (
      <div className="quiz-play-page">
        <div className="quiz-play-scroll">
          <p>Chargement…</p>
        </div>
      </div>
    );
  }

  const total = payload.questions.length;
  const isSubmittingResults = sessionPhase === 'submitting';
  const revealed = feedbackPhase !== 'idle' && !isSubmittingResults;
  const maxSessionPoints = payload.questions.reduce(
    (sum, q) => sum + pointsForDifficulty(q.difficulty),
    0,
  );

  return (
    <div className="quiz-play-page">
      <div
        className="quiz-play-scroll"
        style={revealed || isSubmittingResults ? { overflow: 'hidden' } : undefined}
      >
        <div className="quiz-play-stage">
          <QuizPlayNavbar
            current={currentIndex + 1}
            total={total}
            sessionPoints={sessionPoints}
            maxSessionPoints={maxSessionPoints}
            timerSeconds={timeLeft}
            timerMax={secondsPerQuestion}
            onMenuPress={() => {
              if (window.confirm('Quitter le quiz ? Ta progression sur cette question sera perdue.')) {
                reset();
                navigate(-1);
              }
            }}
          />

          <div className="quiz-play-body">
            <QuizQuestionHeader imageUri={question.imageUrl} questionText={question.questionText} />
            <QuizAnswerGrid
              questionId={question.id}
              options={question.options}
              selectedId={selectedOptionId}
              correctId={question.correctOptionId}
              revealed={revealed}
              onSelect={onPick}
            />
          </div>
        </div>
      </div>

      {feedbackPhase !== 'idle' && !isSubmittingResults ? (
        <QuizFeedbackFunFactModal
          visible={revealed}
          phase={feedbackPhase}
          pointsEarnedLabel={
            feedbackPhase === 'correct'
              ? `+${lastPointsEarned} point${lastPointsEarned > 1 ? 's' : ''}`
              : ''
          }
          funFact={question.explanation?.trim() ?? ''}
          correctAnswerLabel={
            feedbackPhase === 'incorrect' || feedbackPhase === 'timeout' ? correctAnswerLabel : undefined
          }
          continueLabel={currentIndex >= total - 1 ? 'Voir le score' : 'Continuer'}
          continueDisabled={isContinueBusy}
          onContinue={() => void onContinueAfterFeedback()}
        />
      ) : null}

      <QuizResultsProcessingModal visible={isSubmittingResults} />
    </div>
  );
}
