import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { QuizPlayTheme, QUIZ_OPTION_CARD_STYLES } from '@constants/quizPlayTheme';
import { useAuthMe } from '@hooks/useAuthMe';
import { useQuestionTimer } from '@hooks/useQuestionTimer';
import { recordChallengeParticipation } from '@services/defis/participateChallenge.service';
import { submitDuelScore } from '@services/defis/duelRepository';
import { invalidateAuthMeCache } from '@services/auth/authMeRepository';
import { getQuizSessionPersistence } from '@services/quiz/session/quizSessionPersistenceInstance';
import { triggerQuizCorrectFeedback } from '@services/quiz/play/triggerQuizCorrectFeedback';
import { triggerQuizWrongFeedback } from '@services/quiz/play/triggerQuizWrongFeedback';
import { pointsForDifficulty } from '@domain/quiz/difficultyPoints';
import { useQuizPlaySessionStore } from '@stores/quizPlaySessionStore';
import { useAppError } from '@providers/AppErrorProvider';
import { seedDuelQueryCache } from '@hooks/defis/useDuelQuery';
import { notifyUser } from '@platform/notify';
import { Icon } from '@components/ui/Icon';

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
  const secondsPerQuestion = useQuizPlaySessionStore((s) => s.secondsPerQuestion);
  const selectOption = useQuizPlaySessionStore((s) => s.selectOption);
  const advanceFromFeedback = useQuizPlaySessionStore((s) => s.advanceFromFeedback);
  const expireQuestion = useQuizPlaySessionStore((s) => s.expireQuestion);
  const reset = useQuizPlaySessionStore((s) => s.reset);
  const duelId = useQuizPlaySessionStore((s) => s.duelId) ?? params.get('duelId');
  const challengeId = useQuizPlaySessionStore((s) => s.challengeId) ?? params.get('challengeId');
  const expiredForQuestionRef = useRef(false);
  const correctFeedbackKeyRef = useRef<string | null>(null);
  const wrongFeedbackKeyRef = useRef<string | null>(null);

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
    autoStart: feedbackPhase === 'idle',
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
    if (feedbackPhase === 'idle') resume();
    else pause();
  }, [feedbackPhase, pause, resume]);

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
    if (timeLeft <= 0 || !question || feedbackPhase !== 'idle') return;
    const isCorrect = optionId === question.correctOptionId;
    selectOption(
      optionId,
      isCorrect,
      pointsForDifficulty(question.difficulty),
      question.options.find((o) => o.id === question.correctOptionId)?.label ?? '—',
    );
  };

  const onContinueAfterFeedback = async () => {
    if (!quizId || !payload) return;
    const next = advanceFromFeedback();
    if (next === 'continue') return;

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
          await queryClient.invalidateQueries({ queryKey: ['duels-pending'] });
          await queryClient.invalidateQueries({ queryKey: ['duels-recent'] });
          void invalidateAuthMeCache();
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Score duel non enregistré.';
        if (!message.includes('déjà joué')) showAppError(message, { title: 'Duel' });
      }
    }

    if (challengeId && userId) {
      try {
        await recordChallengeParticipation(userId, challengeId, quizId, earned);
        await queryClient.invalidateQueries({ queryKey: ['weekly-challenges'] });
      } catch (error) {
        showAppError(error instanceof Error ? error.message : 'Score challenge non enregistré.', { title: 'Challenge' });
      }
    }

    const qs = new URLSearchParams();
    if (duelId) qs.set('duelId', duelId);
    if (challengeId) qs.set('challengeId', challengeId);
    navigate(`/quiz/${quizId}/congrats${qs.toString() ? `?${qs}` : ''}`, { replace: true });
  };

  if (!payload || !question) return <p style={{ padding: 24 }}>Chargement…</p>;

  const total = payload.questions.length;
  const revealed = feedbackPhase !== 'idle';

  return (
    <div style={{ minHeight: '100svh', background: '#fff', padding: 20, paddingBottom: 140 }}>
      <div style={{ width: 'min(100%, 420px)', margin: '0 auto', display: 'grid', gap: 20 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button type="button" className="btn btn-ghost" style={{ padding: 8 }} onClick={() => {
            if (window.confirm('Quitter le quiz ? Ta progression sur cette question sera perdue.')) {
              reset();
              navigate(-1);
            }
          }}>
            <Icon name="x" />
          </button>
          <strong>{currentIndex + 1}/{total}</strong>
          <span style={{ fontWeight: 900 }}>{sessionPoints} pts</span>
        </header>
        <div className="progress-bar" style={{ background: '#F0F0F0' }}>
          <span style={{ width: `${(timeLeft / secondsPerQuestion) * 100}%`, background: timeLeft < 5 ? QuizPlayTheme.error : '#1F2261' }} />
        </div>
        <div style={{ textAlign: 'center', fontWeight: 800 }}>{timeLeft}s</div>
        {question.imageUrl ? <img src={question.imageUrl} alt="" style={{ borderRadius: 16, maxHeight: 220, objectFit: 'cover' }} /> : null}
        <h2>{question.questionText}</h2>
        <div style={{ display: 'grid', gap: 12 }}>
          {question.options.map((opt, i) => {
            const style = QUIZ_OPTION_CARD_STYLES[i % QUIZ_OPTION_CARD_STYLES.length];
            let bg: string = style.bg;
            if (revealed && opt.id === question.correctOptionId) bg = QuizPlayTheme.success;
            else if (revealed && opt.id === selectedOptionId) bg = QuizPlayTheme.error;
            return (
              <button
                key={opt.id}
                type="button"
                className="quiz-option"
                style={{ background: bg }}
                disabled={revealed}
                onClick={() => onPick(opt.id)}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
      {revealed ? (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h2>{feedbackPhase === 'correct' ? 'Bonne réponse !' : feedbackPhase === 'timeout' ? 'Temps écoulé' : 'Mauvaise réponse'}</h2>
            {question.explanation ? <p className="muted">{question.explanation}</p> : null}
            <button type="button" className="btn btn-primary" style={{ width: '100%', marginTop: 12 }} onClick={() => void onContinueAfterFeedback()}>
              {currentIndex >= total - 1 ? 'Voir le score' : 'Suivant'}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
