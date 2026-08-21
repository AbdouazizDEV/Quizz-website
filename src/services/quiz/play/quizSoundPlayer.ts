const players = new Map<string, HTMLAudioElement>();

export async function playBundledSound(src: string): Promise<void> {
  if (!src || typeof Audio === 'undefined') return;
  try {
    let audio = players.get(src);
    if (!audio) {
      audio = new Audio(src);
      audio.preload = 'auto';
      players.set(src, audio);
    }
    audio.currentTime = 0;
    await audio.play();
  } catch {
    /* autoplay / codec */
  }
}
