import { useMemo } from 'react';

import type { QuizPlayOption } from '@app-types/quizPlay.types';
import { QUIZ_OPTION_CARD_STYLES, QuizPlayTheme } from '@constants/quizPlayTheme';
import { optionsNeedLongBarLayout } from '@utils/quizAnswerLayout';
import { shuffleArray } from '@utils/shuffleArray';
import { Icon } from '@components/ui/Icon';

type AnswerVisualState = 'default' | 'correct' | 'wrong';

interface QuizAnswerGridProps {
  questionId: string;
  options: QuizPlayOption[];
  selectedId: string | null;
  correctId: string;
  revealed: boolean;
  onSelect: (optionId: string) => void;
}

function visualState(
  optId: string,
  selectedId: string | null,
  correctId: string,
  revealed: boolean,
): AnswerVisualState {
  if (!revealed) return 'default';
  if (selectedId === '__timeout__') {
    return optId === correctId ? 'correct' : 'default';
  }
  if (!selectedId) return 'default';
  if (optId === correctId) return 'correct';
  if (optId === selectedId) return 'wrong';
  return 'default';
}

export function QuizAnswerGrid({
  questionId,
  options,
  selectedId,
  correctId,
  revealed,
  onSelect,
}: QuizAnswerGridProps) {
  const answersContentKey = useMemo(
    () =>
      [...options]
        .map((o) => `${o.id}:${o.label}`)
        .sort()
        .join('|'),
    [options],
  );

  const longBarLayout = useMemo(() => optionsNeedLongBarLayout(options), [options]);

  const displayOptions = useMemo(
    () => shuffleArray([...options]),
    [questionId, answersContentKey],
  );

  return (
    <div className={longBarLayout ? 'quiz-answers is-stack' : 'quiz-answers is-grid'}>
      {displayOptions.map((opt, i) => {
        const palette = QUIZ_OPTION_CARD_STYLES[i % QUIZ_OPTION_CARD_STYLES.length]!;
        const state = visualState(opt.id, selectedId, correctId, revealed);
        const bg =
          state === 'correct' ? QuizPlayTheme.success : state === 'wrong' ? QuizPlayTheme.error : palette.bg;
        const border = state === 'default' ? palette.border : 'transparent';

        return (
          <button
            key={opt.id}
            type="button"
            className="quiz-option-card"
            disabled={revealed}
            onClick={() => onSelect(opt.id)}
            style={{ background: bg, borderBottomColor: border }}
          >
            {state !== 'default' ? (
              <span className="quiz-option-badge">
                <Icon name={state === 'correct' ? 'check' : 'x'} size={14} color="#FFFFFF" />
              </span>
            ) : null}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
