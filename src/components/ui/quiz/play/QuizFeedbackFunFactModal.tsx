import { QuizPlayTheme } from '@constants/quizPlayTheme';
import type { QuizFeedbackPhase } from '@stores/quizPlaySessionStore';

interface QuizFeedbackFunFactModalProps {
  visible: boolean;
  phase: Exclude<QuizFeedbackPhase, 'idle'>;
  pointsEarnedLabel: string;
  funFact: string;
  correctAnswerLabel?: string;
  continueLabel: string;
  onContinue: () => void;
}

function titleForPhase(phase: Exclude<QuizFeedbackPhase, 'idle'>): string {
  if (phase === 'correct') return 'Bonne réponse !';
  if (phase === 'timeout') return 'Temps écoulé';
  return 'Mauvaise réponse';
}

function accentColor(phase: Exclude<QuizFeedbackPhase, 'idle'>): string {
  if (phase === 'correct') return QuizPlayTheme.success;
  if (phase === 'timeout') return '#F59E0B';
  return QuizPlayTheme.error;
}

export function QuizFeedbackFunFactModal({
  visible,
  phase,
  pointsEarnedLabel,
  funFact,
  correctAnswerLabel,
  continueLabel,
  onContinue,
}: QuizFeedbackFunFactModalProps) {
  if (!visible) return null;

  const accent = accentColor(phase);
  const trimmedFact = funFact.trim();
  const body =
    trimmedFact ||
    (phase === 'correct'
      ? 'Continuez pour garder le rythme.'
      : 'Retenez la bonne réponse pour la prochaine fois.');

  return (
    <div className="quiz-feedback-backdrop" role="dialog" aria-modal="true" aria-labelledby="quiz-feedback-title">
      <div className="quiz-feedback-sheet">
        <div className="quiz-feedback-accent" style={{ background: accent }} />
        <h2 id="quiz-feedback-title" className="quiz-feedback-title">
          {titleForPhase(phase)}
        </h2>
        {phase === 'correct' ? (
          <p className="quiz-feedback-points" style={{ color: accent }}>
            {pointsEarnedLabel}
          </p>
        ) : null}
        {phase !== 'correct' && correctAnswerLabel ? (
          <p className="quiz-feedback-hint">Bonne réponse : {correctAnswerLabel}</p>
        ) : null}
        <p className="quiz-feedback-label">Le saviez-vous ?</p>
        <p className="quiz-feedback-body">{body}</p>
        <button type="button" className="quiz-feedback-cta" onClick={onContinue}>
          {continueLabel}
        </button>
      </div>
    </div>
  );
}
