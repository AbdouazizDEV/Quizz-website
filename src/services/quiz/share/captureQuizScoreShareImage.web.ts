import type { RefObject } from 'react';
import html2canvas from 'html2canvas';

import { QUIZ_SHARE_CAPTURE_ID } from '@services/quiz/share/quizShareCaptureConstants';

function resolveDomNode(ref: RefObject<HTMLElement | null>): HTMLElement {
  if (typeof document !== 'undefined') {
    const byId = document.getElementById(QUIZ_SHARE_CAPTURE_ID);
    if (byId) return byId;
  }

  const node = ref.current;
  if (node) return node;
  throw new Error('Carte de partage non prête.');
}

export async function captureQuizScoreShareImage(
  cardRef: RefObject<HTMLElement | null>,
): Promise<string> {
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  const domNode = resolveDomNode(cardRef);
  const canvas = await html2canvas(domNode, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#FFB703',
    logging: false,
  });

  return canvas.toDataURL('image/png');
}
