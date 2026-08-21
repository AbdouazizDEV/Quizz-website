import { playQuizSoundForSlot } from '@services/quiz/play/playQuizSoundForSlot';

export async function triggerQuizWrongFeedback(): Promise<void> {
  try {
    navigator.vibrate?.([0, 80, 40, 80]);
  } catch {
    /* ignore */
  }
  await playQuizSoundForSlot('wrongAnswer');
}
