import { playQuizSoundForSlot } from '@services/quiz/play/playQuizSoundForSlot';

export async function triggerQuizCorrectFeedback(): Promise<void> {
  try {
    navigator.vibrate?.(40);
  } catch {
    /* ignore */
  }
  await playQuizSoundForSlot('correctAnswer');
}
