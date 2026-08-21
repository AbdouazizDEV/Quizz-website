import { notifyUser } from '@platform/notify';
import type { IQuizScoreSharePort } from '@services/quiz/share/IQuizScoreSharePort';

export class AlertQuizScoreShareAdapter implements IQuizScoreSharePort {
  async shareScore(params: {
    quizTitle: string;
    score: number;
    correctCount: number;
    total: number;
  }): Promise<void> {
    const text = `« ${params.quizTitle} » — ${params.correctCount}/${params.total} bonnes réponses, ${params.score} pts.`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: 'Mon score Quizz+', text });
        return;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      notifyUser('Score copié', text);
    } catch {
      notifyUser('Partage', text);
    }
  }
}
