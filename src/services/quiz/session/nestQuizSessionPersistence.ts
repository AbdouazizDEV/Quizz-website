import type { QuizAnswerRecord } from '@app-types/quizPlay.types';
import { parseQuizzApiError } from '@sdk';
import { apiClient } from '@services/api/apiClient';
import { loadAuthMe, patchAuthMeFromQuizComplete } from '@services/auth/authMeRepository';
import { refreshAuthSessionIfNeeded } from '@services/auth/refreshAuthSession';
import type { IQuizSessionPersistence } from '@services/quiz/session/IQuizSessionPersistence';
import { enqueueApiMutation, runOnlineOrQueue } from '@services/offline/offlineMutation';
import {
  quizCompleteApiPath,
  type QuizSessionCompleteBody,
  type QuizSessionCompleteResponse,
} from '@services/offline/quizSessionMutations';
import { useAuthStore } from '@stores/authStore';
import { isAxiosError } from 'axios';

function mapAnswers(answers: QuizAnswerRecord[]) {
  return answers.map((a) => ({
    questionId: a.questionId,
    selected: a.selectedOptionId,
    correct: a.isCorrect,
  }));
}

export class NestQuizSessionPersistence implements IQuizSessionPersistence {
  async recordCompletedSession(params: {
    quizId: string;
    earnedPoints: number;
    answers: QuizAnswerRecord[];
  }): Promise<{ ok: boolean; errorMessage?: string }> {
    if (!useAuthStore.getState().token?.trim()) {
      return { ok: false, errorMessage: 'Utilisateur non connecté (session invalide).' };
    }

    const refreshed = await refreshAuthSessionIfNeeded();
    if (!refreshed.ok && refreshed.reason === 'refresh_failed') {
      try {
        await this.queueOffline(params);
        return { ok: true };
      } catch {
        return {
          ok: false,
          errorMessage: 'Session expirée. Reconnectez-vous pour enregistrer votre score.',
        };
      }
    }

    try {
      const result = await runOnlineOrQueue(
        () => this.persistOnline(params),
        () => this.queueOffline(params),
      );
      if (result.queued) return { ok: true };
      return result.data ?? { ok: false, errorMessage: 'Enregistrement impossible.' };
    } catch (error) {
      try {
        await this.queueOffline(params);
        return { ok: true };
      } catch {
        const message = error instanceof Error ? error.message : 'Enregistrement impossible.';
        return { ok: false, errorMessage: message };
      }
    }
  }

  private buildBody(params: {
    earnedPoints: number;
    answers: QuizAnswerRecord[];
  }): QuizSessionCompleteBody {
    const answers = mapAnswers(params.answers);
    return answers.length > 0
      ? { score: params.earnedPoints, answers }
      : { score: params.earnedPoints };
  }

  private async persistOnline(params: {
    quizId: string;
    earnedPoints: number;
    answers: QuizAnswerRecord[];
  }): Promise<{ ok: boolean; errorMessage?: string }> {
    const path = quizCompleteApiPath(params.quizId);
    const body = this.buildBody(params);

    try {
      const { data } = await apiClient.post<QuizSessionCompleteResponse>(path, body);
      if (data) {
        await patchAuthMeFromQuizComplete({
          total_score: data.total_score,
          quizzes_completed: data.quizzes_completed,
        });
      }
      void loadAuthMe({ force: true });
      return { ok: true };
    } catch (error) {
      const message = this.formatApiError(error);
      throw new Error(message);
    }
  }

  private formatApiError(error: unknown): string {
    if (isAxiosError(error)) {
      const body = error.response?.data;
      return (
        parseQuizzApiError(body) ??
        (typeof body === 'object' && body && 'message' in body
          ? String((body as { message?: unknown }).message)
          : null) ??
        error.message ??
        'Enregistrement impossible.'
      );
    }
    return error instanceof Error ? error.message : 'Enregistrement impossible.';
  }

  private async queueOffline(params: {
    quizId: string;
    earnedPoints: number;
    answers: QuizAnswerRecord[];
  }): Promise<void> {
    await enqueueApiMutation({
      method: 'POST',
      path: quizCompleteApiPath(params.quizId),
      body: this.buildBody(params),
    });
  }
}
