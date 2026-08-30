import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { QuizSoundSlot } from '@app-types/quizSoundPreferences.types';
import { Icon } from '@components/ui/Icon';
import { MusicSoundSlotRow } from '@components/ui/settings/MusicSoundSlotRow';
import { QuizSoundPickerModal } from '@components/ui/settings/QuizSoundPickerModal';
import { SettingsLeadingHeader } from '@components/ui/settings/SettingsLeadingHeader';
import { SettingsMenuRow } from '@components/ui/settings/SettingsMenuRow';
import { SettingsSectionCard } from '@components/ui/settings/SettingsSectionCard';
import { QUIZ_SOUND_SLOT_META } from '@constants/quizSoundSlots';
import { Routes } from '@constants/Routes';
import { useQuizSoundPreferencesStore } from '@stores/quizSoundPreferencesStore';
import { useSettingsStore } from '@stores/settingsStore';

export function MusicPage() {
  const navigate = useNavigate();
  const musicEnabled = useSettingsStore((s) => s.musicEnabled);
  const setMusicEnabled = useSettingsStore((s) => s.setMusicEnabled);
  const sounds = useQuizSoundPreferencesStore((s) => s.sounds);
  const setSoundForSlot = useQuizSoundPreferencesStore((s) => s.setSoundForSlot);
  const resetToDefaults = useQuizSoundPreferencesStore((s) => s.resetToDefaults);
  const [pickerSlot, setPickerSlot] = useState<QuizSoundSlot | null>(null);

  const pickerMeta = useMemo(
    () => (pickerSlot ? QUIZ_SOUND_SLOT_META.find((meta) => meta.slot === pickerSlot) : null),
    [pickerSlot],
  );

  return (
    <div className="settings-page is-sub">
      <SettingsLeadingHeader
        title="Musique et effets"
        onBack={() => {
          if (window.history.length > 1) navigate(-1);
          else navigate(Routes.SETTINGS, { replace: true });
        }}
      />

      <div className="settings-sub-board settings-music-board">
        <div className="settings-sub-primary">
          <section className="settings-framed-hero gains-fade">
            <div className="settings-framed-hero-inner">
              <span className="settings-framed-hero-icon">
                <Icon name="volume-2" size={28} color="#1F2261" />
              </span>
              <h2>Personnalise tes sons</h2>
              <p>Choisis un son pour chaque moment du quiz. Appuie sur ▶ pour écouter un aperçu.</p>
            </div>
          </section>

          <SettingsSectionCard>
            <SettingsMenuRow
              variant="toggle"
              label="Activer les sons du quiz"
              icon="volume-2"
              iconBackground="#EDE7F6"
              iconColor="#F9A825"
              value={musicEnabled}
              onValueChange={setMusicEnabled}
            />
          </SettingsSectionCard>
        </div>

        <div className="settings-sub-secondary settings-music-slots">
          <SettingsSectionCard title="Pendant le quiz">
            {QUIZ_SOUND_SLOT_META.filter(
              (meta) => meta.slot === 'correctAnswer' || meta.slot === 'wrongAnswer',
            ).map((meta) => (
              <MusicSoundSlotRow
                key={meta.slot}
                meta={meta}
                selectedSoundId={sounds[meta.slot]}
                onPress={() => setPickerSlot(meta.slot)}
              />
            ))}
          </SettingsSectionCard>

          <SettingsSectionCard title="Fin de quiz">
            {QUIZ_SOUND_SLOT_META.filter(
              (meta) =>
                meta.slot === 'victoryPerfect' ||
                meta.slot === 'victoryPartial' ||
                meta.slot === 'defeat',
            ).map((meta) => (
              <MusicSoundSlotRow
                key={meta.slot}
                meta={meta}
                selectedSoundId={sounds[meta.slot]}
                onPress={() => setPickerSlot(meta.slot)}
              />
            ))}
          </SettingsSectionCard>

          <button type="button" className="settings-reset-btn" onClick={() => resetToDefaults()}>
            <Icon name="rotate-ccw" size={18} color="#616161" />
            Réinitialiser les sons par défaut
          </button>
        </div>
      </div>

      {pickerSlot && pickerMeta ? (
        <QuizSoundPickerModal
          title={pickerMeta.title}
          selectedId={sounds[pickerSlot]}
          onClose={() => setPickerSlot(null)}
          onSelect={(id) => {
            setSoundForSlot(pickerSlot, id);
            setPickerSlot(null);
          }}
        />
      ) : null}
    </div>
  );
}
