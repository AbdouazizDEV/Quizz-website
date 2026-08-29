import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Routes } from '@constants/Routes';
import type { QuizPlayPayload } from '@app-types/quizPlay.types';
import { delay } from '@utils/delay';
import { buildQuizQuestionSet } from '@domain/quiz/buildQuizQuestionSet';
import { getQuizPlayRepository } from '@services/quiz/play/quizPlayRepositoryInstance';
import { useQuizPlaySessionStore } from '@stores/quizPlaySessionStore';

const LOADER_MS = 1200;

export function QuizEntryPage() {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [params] = useSearchParams();
  const categorySlug = params.get('categorySlug');
  const duelId = params.get('duelId');
  const challengeId = params.get('challengeId');
  const bootstrap = useQuizPlaySessionStore((s) => s.bootstrap);
  const reset = useQuizPlaySessionStore((s) => s.reset);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const startPlay = useCallback(
    (raw: QuizPlayPayload) => {
      if (!quizId) return;
      const composed = buildQuizQuestionSet({
        pool: raw.questions,
        totalQuestions: raw.questions.length,
        quizLevel: raw.quiz.difficultyLevel,
        seed: quizId,
      });
      bootstrap(
        { ...raw, questions: composed.questions },
        categorySlug,
        duelId,
        challengeId,
      );
      navigate(`/quiz/${quizId}/play`, { replace: true });
    },
    [bootstrap, categorySlug, challengeId, duelId, navigate, quizId],
  );

  useEffect(() => {
    reset();
    const started = Date.now();
    const tick = window.setInterval(() => {
      setProgress(Math.min(1, (Date.now() - started) / LOADER_MS));
    }, 50);
    return () => window.clearInterval(tick);
  }, [quizId, reset]);

  useEffect(() => {
    if (!quizId) {
      setError('Quiz introuvable.');
      return;
    }
    let cancelled = false;
    void (async () => {
      const repo = getQuizPlayRepository();
      const [raw] = await Promise.all([repo.loadPlayPayload(quizId), delay(LOADER_MS)]);
      if (cancelled) return;
      if (!raw?.questions.length) {
        setError('Impossible de charger ce quiz. Vérifie la config catalogue ou réessaie.');
        return;
      }
      startPlay(raw);
    })();
    return () => {
      cancelled = true;
    };
  }, [quizId, startPlay]);

  return (
    <div className="quiz-entry-page">
      <div className="quiz-entry-card">
        <img src="/assets/icons/logo.png" alt="Quizz+" width={72} height={72} style={{ margin: '0 auto 16px' }} />
        <h1 style={{ margin: '0 0 16px' }}>Préparation du quiz</h1>
        <div className="progress-bar" style={{ background: '#FFFFFF' }}>
          <span style={{ width: `${Math.round(progress * 100)}%`, background: '#1F2261' }} />
        </div>
        {error ? (
          <>
            <p className="error-text" style={{ marginTop: 16 }}>
              {error}
            </p>
            <button
              type="button"
              className="btn btn-primary"
              style={{ marginTop: 12 }}
              onClick={() => navigate(Routes.CATEGORIES)}
            >
              Retour aux catégories
            </button>
          </>
        ) : (
          <p style={{ fontWeight: 700, marginTop: 16 }}>Chargement des questions…</p>
        )}
      </div>
    </div>
  );
}
