import type { DailyQuiz } from '@app-types/challenge.types';
import { formatLongDate } from '@utils/defis/formatDefisTime';

interface ChallengeMissionRowProps {
  quiz: DailyQuiz;
  onPress: () => void;
}

export function ChallengeMissionRow({ quiz, onPress }: ChallengeMissionRowProps) {
  const locked = !quiz.isAvailable && !quiz.isPlayed;
  const label = quiz.isPlayed
    ? `Terminé · ${quiz.userScore ?? 0} pts`
    : locked
      ? `Disponible le ${formatLongDate(quiz.scheduledDay)}`
      : 'À jouer';
  return (
    <button type="button" className="defis-mission defis-fade" disabled={locked} onClick={onPress}>
      <span className="defis-mission-index">{quiz.dayOrder}</span>
      <span style={{ flex: 1 }}>
        <strong style={{ display: 'block' }}>{quiz.title}</strong>
        <span className="defis-muted">{quiz.difficulty} · {label}</span>
      </span>
    </button>
  );
}
