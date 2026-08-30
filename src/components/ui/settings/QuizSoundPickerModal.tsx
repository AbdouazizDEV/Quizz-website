import { useEffect } from 'react';

import { Icon } from '@components/ui/Icon';
import { QUIZ_SOUND_CATALOG } from '@constants/quizSoundCatalog';
import { previewQuizSound } from '@services/quiz/play/playQuizSoundForSlot';

interface QuizSoundPickerModalProps {
  title: string;
  selectedId: string;
  onClose: () => void;
  onSelect: (soundId: string) => void;
}

export function QuizSoundPickerModal({
  title,
  selectedId,
  onClose,
  onSelect,
}: QuizSoundPickerModalProps) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="settings-logout-overlay" role="dialog" aria-modal="true" aria-labelledby="sound-picker-title">
      <button type="button" className="settings-logout-backdrop" aria-label="Fermer" onClick={onClose} />
      <div className="settings-sound-sheet">
        <span className="settings-logout-handle" />
        <h2 id="sound-picker-title">{title}</h2>
        <p className="settings-sound-sheet-sub">{QUIZ_SOUND_CATALOG.length} sons disponibles</p>
        <ul className="settings-sound-sheet-list">
          {QUIZ_SOUND_CATALOG.map((sound) => {
            const selected = sound.id === selectedId;
            return (
              <li key={sound.id} className="settings-sound-sheet-row">
                <button
                  type="button"
                  className="settings-sound-sheet-main"
                  onClick={() => onSelect(sound.id)}
                >
                  <Icon
                    name={selected ? 'check-circle' : 'circle'}
                    size={22}
                    color={selected ? '#FFB703' : '#BDBDBD'}
                  />
                  <span>
                    <strong>{sound.label}</strong>
                    <em>{sound.fileName}</em>
                  </span>
                </button>
                <button
                  type="button"
                  className="settings-sound-play"
                  aria-label={`Écouter ${sound.label}`}
                  onClick={() => void previewQuizSound(sound.id)}
                >
                  <Icon name="play" size={18} color="#1F2261" />
                </button>
              </li>
            );
          })}
        </ul>
        <button type="button" className="settings-text-btn" onClick={onClose}>
          Fermer
        </button>
      </div>
    </div>
  );
}
