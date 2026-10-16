import type { QuizAnswerRecord } from '@app-types/quizPlay.types';
import { parseQuizzApiError } from '@sdk';
import { apiClient } from '@services/api/apiClient';
import { loadAuthMe, patchAuthMeFromQuizComplete } from '@services/auth/authMeRepository';
import { refreshAuthSessionIfNeeded } from '@services/auth/refreshAuthSession';
import type { IQuizSessionPersistence } from '@services/quiz/session/IQuizSessionPersistence';
import { enqueueApiMutation } from '@services/offline/offlineMutation';
import { fetchNetworkOnline } from '@services/offline/networkStatus';
import {
  parseQuizCompleteResponse,
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

    const online = await fetchNetworkOnline();
    const refreshed = await refreshAuthSessionIfNeeded();
    if (!refreshed.ok && refreshed.reason === 'refresh_failed') {
      if (!online) {
        await this.queueOffline(params);
        return { ok: true };
      }
      return {
        ok: false,
        errorMessage: 'Session expirée. Reconnectez-vous pour enregistrer votre score.',
      };
    }

    if (!online) {
      await this.queueOffline(params);
      return { ok: true };
    }

    try {
      return await this.persistOnline(params);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Enregistrement impossible.';
      return { ok: false, errorMessage: message };
    }
  }

  private buildBody(params: {
    earnedPoints: number;
    answers: QuizAnswerRecord[];
  }): QuizSessionCompleteBody {
    const answers = mapAnswers(params.answers);
    const express = sessionStorage.getItem('quizz.express') === '1';
    if (express) sessionStorage.removeItem('quizz.express');
    const kind = express ? 'express' : 'standard';
    return answers.length > 0
      ? { score: params.earnedPoints, answers, mode: 'scored' as const, kind: kind as 'standard' | 'express' }
      : { score: params.earnedPoints, mode: 'scored' as const, kind: kind as 'standard' | 'express' };
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
      const parsed = parseQuizCompleteResponse(data);
      if (parsed) {
        await patchAuthMeFromQuizComplete(parsed);
      }
      const remote = await loadAuthMe({ force: true });
      if (parsed && (remote?.profile?.total_score ?? 0) < parsed.total_score) {
        await patchAuthMeFromQuizComplete(parsed);
      }
      return { ok: true };
    } catch (error) {
      throw new Error(this.formatApiError(error));
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
