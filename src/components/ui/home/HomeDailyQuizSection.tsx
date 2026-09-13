import type { DailyQuizCard, DailyQuizSlot } from '@app-types/dailyQuiz.types';
import { Icon } from '@components/ui/Icon';
import { formatLevelCodeLabel } from '@utils/levelDisplay';

const SLOT_ICONS: Record<DailyQuizSlot, string> = {
  popular: 'trending-up',
  profile: 'user',
  recent: 'clock',
};

interface HomeDailyQuizSectionProps {
  quizzes: DailyQuizCard[];
  loading: boolean;
  error?: Error | null;
  onPressQuiz: (quiz: DailyQuizCard) => void;
}

function difficultyLabel(level: string | null): string {
  if (!level) return 'Tous niveaux';
  return formatLevelCodeLabel(level).replace(/^[^\s]+\s/, '');
}

export function HomeDailyQuizSection({
  quizzes,
  loading,
  error,
  onPressQuiz,
}: HomeDailyQuizSectionProps) {
  if (loading) {
    return <div className="home-loading">Chargement…</div>;
  }

  if (error) {
    return <p className="home-empty-note">{error.message}</p>;
  }

  if (quizzes.length === 0) {
    return <p className="home-empty-note">Aucun quiz du jour pour le moment.</p>;
  }

  return (
    <div className="home-daily-quiz-col">
      {quizzes.map((quiz) => {
        const disabled = !quiz.isPlayable;
        const meta = `${quiz.questionCount} questions · ${difficultyLabel(quiz.difficultyLevel)}`;

        return (
          <button
            key={`${quiz.slot}-${quiz.id}`}
            type="button"
            className={`home-daily-quiz-row${disabled ? ' is-disabled' : ''}`}
            disabled={disabled}
            aria-label={`${quiz.label} — ${quiz.title}`}
            onClick={() => onPressQuiz(quiz)}
          >
            {quiz.thumbnailUrl ? (
              <img src={quiz.thumbnailUrl} alt="" className="home-daily-quiz-thumb" />
            ) : (
              <span className="home-daily-quiz-icon" aria-hidden>
                <Icon name={SLOT_ICONS[quiz.slot]} size={18} color="#B88700" />
              </span>
            )}
            <span className="home-daily-quiz-text">
              <span className="home-daily-quiz-slot">{quiz.label}</span>
              <span className="home-daily-quiz-title">{quiz.title}</span>
              <span className="home-daily-quiz-meta">{meta}</span>
              {disabled ? (
                <span className="home-daily-quiz-done">Terminé — nouveaux quiz à 00h00</span>
              ) : null}
            </span>
            {disabled ? (
              <Icon name="check-circle" size={18} color="#9CA3AF" />
            ) : (
              <Icon name="chevron-right" size={18} color="#A1A1AA" />
            )}
          </button>
        );
      })}
    </div>
  );
}
