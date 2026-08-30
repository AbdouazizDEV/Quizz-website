import type { CSSProperties } from 'react';

import { Icon } from '@components/ui/Icon';
import { getQuizSoundLabel } from '@constants/quizSoundCatalog';
import type { QuizSoundSlotMeta } from '@constants/quizSoundSlots';

interface MusicSoundSlotRowProps {
  meta: QuizSoundSlotMeta;
  selectedSoundId: string;
  onPress: () => void;
}

export function MusicSoundSlotRow({ meta, selectedSoundId, onPress }: MusicSoundSlotRowProps) {
  return (
    <button
      type="button"
      className="settings-sound-slot"
      onClick={onPress}
      aria-label={`${meta.title}, son actuel ${getQuizSoundLabel(selectedSoundId)}`}
    >
      <span
        className="settings-row-icon is-lg"
        style={{ '--icon-bg': meta.iconBackground, '--icon-fg': meta.iconColor } as CSSProperties}
      >
        <Icon name={meta.icon} size={20} />
      </span>
      <span className="settings-sound-slot-text">
        <strong>{meta.title}</strong>
        <em>{meta.description}</em>
        <b>{getQuizSoundLabel(selectedSoundId)}</b>
      </span>
      <Icon name="chevron-right" size={20} color="#BDBDBD" />
    </button>
  );
}
