const SHARE_URL = 'https://quizzplus.app';

async function dataUriToFile(dataUri: string): Promise<File> {
  const res = await fetch(dataUri);
  const blob = await res.blob();
  return new File([blob], `quizz-score-${Date.now()}.png`, { type: 'image/png' });
}

async function tryWebShareFile(file: File, title: string): Promise<boolean> {
  const nav = typeof navigator !== 'undefined' ? navigator : null;
  if (!nav?.share) return false;

  const payload = { files: [file], title, text: 'Mon score sur Quizz+ !' };
  if (nav.canShare && !nav.canShare(payload)) return false;

  try {
    await nav.share(payload);
    return true;
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') return true;
    return false;
  }
}

function downloadDataUri(dataUri: string): void {
  const anchor = document.createElement('a');
  anchor.href = dataUri;
  anchor.download = `quizz-score-${Date.now()}.png`;
  anchor.click();
}

export async function shareScoreImage(imageUri: string, _dialogTitle: string): Promise<void> {
  const file = await dataUriToFile(imageUri);
  const shared = await tryWebShareFile(file, 'Mon score Quizz+');
  if (!shared) downloadDataUri(imageUri);
}

export async function shareImageViaWhatsApp(imageUri: string): Promise<void> {
  const file = await dataUriToFile(imageUri);
  if (await tryWebShareFile(file, 'Quizz+ — WhatsApp')) return;
  downloadDataUri(imageUri);
  const text = encodeURIComponent('Mon score sur Quizz+ !');
  window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
}

export async function shareImageViaFacebook(imageUri: string): Promise<void> {
  const file = await dataUriToFile(imageUri);
  if (await tryWebShareFile(file, 'Quizz+ — Facebook')) return;
  downloadDataUri(imageUri);
  const params = new URLSearchParams({ u: SHARE_URL });
  window.open(`https://www.facebook.com/sharer/sharer.php?${params.toString()}`, '_blank', 'noopener,noreferrer');
}

export async function shareImageViaSystemSheet(imageUri: string): Promise<void> {
  await shareScoreImage(imageUri, 'Partager mon score');
}
