import {
  applyOptimisticChallengeParticipation,
  findCachedChallengeQuiz,
} from '@services/offline/challengeCacheOptimistic';
import { enqueueApiMutation } from '@services/offline/offlineMutation';
import { fetchNetworkOnline } from '@services/offline/networkStatus';
import { offlineStore } from '@services/offline/OfflineStore';
import type { OfflineMutationResult } from '@services/offline/types';
import { apiClient } from '@services/api/apiClient';
import { fetchChallengeProgress } from '@services/defis/challengeRepository';
import { authHeaders, isConflict, isNotFound } from '@services/defis/nestDefisHelpers';
import { extractApiError } from '@utils/extractApiError';
import { formatLongDate } from '@utils/defis/formatDefisTime';

export class ChallengeParticipationError extends Error {
  constructor(
    public readonly code:
      | 'ALREADY_PLAYED'
      | 'NOT_YET_AVAILABLE'
      | 'NOT_CONFIGURED'
      | 'OFFLINE_NO_CACHE'
      | 'GLOBALLY_COMPLETED',
    message: string,
  ) {
    super(message);
    this.name = 'ChallengeParticipationError';
  }
}

function participatePath(challengeId: string): string {
  return `/defis/challenges/${encodeURIComponent(challengeId)}/participations`;
}

async function assertFromProgress(
  userId: string,
  challengeId: string,
  quizId: string,
  scheduledDay: string,
  online: boolean,
): Promise<void> {
  const quiz = online
    ? (await fetchChallengeProgress(challengeId, userId)).dailyQuizzes.find((item) => item.quizId === quizId)
    : await findCachedChallengeQuiz(userId, challengeId, quizId);

  if (!quiz) {
    throw new ChallengeParticipationError(
      online ? 'NOT_CONFIGURED' : 'OFFLINE_NO_CACHE',
      online
        ? 'Mission introuvable pour ce challenge.'
        : 'Challenge indisponible hors ligne. Ouvrez-le une fois en ligne.',
    );
  }

  if (quiz.isPlayed) {
    throw new ChallengeParticipationError(
      'ALREADY_PLAYED',
      'Vous avez déjà joué ce quiz dans ce challenge.',
    );
  }

  if (quiz.globallyCompleted) {
    throw new ChallengeParticipationError(
      'GLOBALLY_COMPLETED',
      'Vous avez déjà terminé ce quiz. Il n’est pas rejouable en challenge.',
    );
  }

  const today = new Date().toISOString().split('T')[0] ?? '';
  if (scheduledDay > today || !quiz.isAvailable) {
    throw new ChallengeParticipationError(
      'NOT_YET_AVAILABLE',
      `Ce quiz sera disponible le ${formatLongDate(scheduledDay)}.`,
    );
  }
}

export async function assertCanParticipateInChallengeQuiz(
  userId: string,
  challengeId: string,
  quizId: string,
  scheduledDay: string,
): Promise<void> {
  await assertFromProgress(userId, challengeId, quizId, scheduledDay, await fetchNetworkOnline());
}

async function recordParticipationOnline(
  challengeId: string,
  quizId: string,
  score: number,
): Promise<void> {
  try {
    await apiClient.post(
      participatePath(challengeId),
      { quiz_id: quizId, score },
      { headers: authHeaders() },
    );
  } catch (error) {
    // Route optionnelle : si Nest crédite déjà via POST /quizzes/:id/complete, un 404 est normal.
    if (isNotFound(error)) return;
    if (isConflict(error)) {
      throw new ChallengeParticipationError(
        'ALREADY_PLAYED',
        'Vous avez déjà joué ce quiz dans ce challenge.',
      );
    }
    throw new Error(extractApiError(error, 'Score challenge non enregistré.'));
  }
}

export async function recordChallengeParticipation(
  userId: string,
  challengeId: string,
  quizId: string,
  score: number,
): Promise<OfflineMutationResult> {
  const online = await fetchNetworkOnline();
  if (!online) {
    const path = participatePath(challengeId);
    const alreadyQueued = await offlineStore.hasPendingMutation(path, { quiz_id: quizId });
    if (alreadyQueued) throw new Error('Score déjà en attente de synchronisation.');
    await enqueueApiMutation({
      method: 'POST',
      path,
      body: { quiz_id: quizId, score },
    });
    await applyOptimisticChallengeParticipation(userId, challengeId, quizId, score);
    return { queued: true };
  }

  await recordParticipationOnline(challengeId, quizId, score);
  await applyOptimisticChallengeParticipation(userId, challengeId, quizId, score);
  return { queued: false };
}
