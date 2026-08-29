import { QuizPlayTheme } from '@constants/quizPlayTheme';
import { Icon } from '@components/ui/Icon';

interface QuizPlayNavbarProps {
  current: number;
  total: number;
  sessionPoints: number;
  maxSessionPoints?: number;
  timerSeconds: number;
  timerMax: number;
  onMenuPress?: () => void;
}

function timerColor(progress: number): string {
  if (progress <= 0.3) return '#E8431A';
  if (progress <= 0.6) return '#F5A623';
  return '#4CAF50';
}

export function QuizPlayNavbar({
  current,
  total,
  sessionPoints,
  maxSessionPoints,
  timerSeconds,
  timerMax,
  onMenuPress,
}: QuizPlayNavbarProps) {
  const progress = timerMax > 0 ? Math.max(0, Math.min(1, timerSeconds / timerMax)) : 0;
  const urgent = progress <= 0.3;
  const color = timerColor(progress);

  return (
    <div className="quiz-play-nav">
      <div className="quiz-play-nav-row">
        <span className="quiz-play-progress-text">
          {current}/{total}
        </span>
        <div className="quiz-play-nav-center">
          <p className="quiz-play-nav-title">Quiz</p>
          <p className="quiz-play-nav-score">
            {maxSessionPoints !== undefined
              ? `${sessionPoints} / ${maxSessionPoints} pts`
              : `${sessionPoints} pts`}
          </p>
        </div>
        <button type="button" className="quiz-play-icon-btn" aria-label="Quitter le quiz" onClick={onMenuPress}>
          <Icon name="x" size={20} color={QuizPlayTheme.grey900} />
        </button>
      </div>
      <div className="quiz-timer">
        <div
          className={urgent ? 'quiz-timer-chip is-urgent' : 'quiz-timer-chip'}
          style={{ ['--p' as string]: Math.round(progress * 100), ['--timer-color' as string]: color }}
        >
          {timerSeconds}s
        </div>
        <div className="quiz-timer-track">
          <div className="quiz-timer-fill" style={{ width: `${progress * 100}%`, background: color }} />
        </div>
        <span className={urgent ? 'quiz-timer-text is-urgent' : 'quiz-timer-text'}>{timerSeconds}s</span>
      </div>
    </div>
  );
}
