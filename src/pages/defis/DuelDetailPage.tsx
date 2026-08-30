import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { DefisNavbar } from '@components/ui/defis/DefisNavbar';
import { DuelMatchHero } from '@components/ui/defis/DuelMatchHero';
import { SectionTitle } from '@components/ui/defis/SectionTitle';
import { DefisRoutes } from '@constants/defisRoutes';
import { buildQuizEntryHref } from '@constants/Routes';
import { useAuthMe } from '@hooks/useAuthMe';
import { isDuelResultReady, useDuelQuery } from '@hooks/defis/useDuelQuery';
import { notifyUser } from '@platform/notify';
import { useAppError } from '@providers/AppErrorProvider';
import { respondToDuel } from '@services/defis/duelRepository';
import { isQuizFullyCompletedByPlayer } from '@services/quiz/replay/quizReplayService';
import { getDuelUiState } from '@utils/defis/getDuelUiState';

export function DuelDetailPage() {
  const { id } = useParams();
  const duelId = id?.trim() ?? '';
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showAppError } = useAppError();
  const { data: me } = useAuthMe();
  const userId = me?.user?.id ?? '';
  const [busy, setBusy] = useState(false);

  const { data: duel, isLoading, isError, error, refetch } = useDuelQuery(duelId);
  const { data: quizFullyCompleted = false } = useQuery({
    queryKey: ['quiz-fully-completed', userId, duel?.quizId],
    enabled: Boolean(userId && duel?.quizId),
    queryFn: () => isQuizFullyCompletedByPlayer(userId, duel!.quizId),
  });

  useEffect(() => {
    if (!isError) return;
    showAppError(error instanceof Error ? error.message : 'Impossible de charger le duel.', {
      title: 'Duel',
      onRetry: () => void refetch(),
    });
  }, [error, isError, refetch, showAppError]);

  useEffect(() => {
    if (!duelId) return;
    const refreshOnFocus = () => {
      if (document.visibilityState === 'hidden') return;
      void refetch();
    };
    refreshOnFocus();
    window.addEventListener('focus', refreshOnFocus);
    document.addEventListener('visibilitychange', refreshOnFocus);
    return () => {
      window.removeEventListener('focus', refreshOnFocus);
      document.removeEventListener('visibilitychange', refreshOnFocus);
    };
  }, [duelId, refetch]);

  useEffect(() => {
    if (!duel) return;
    const finished =
      duel.status === 'completed' ||
      (duel.challengerScore !== null && duel.challengedScore !== null && isDuelResultReady(duel));
    if (finished) {
      navigate(DefisRoutes.duelResult(duel.id), { replace: true });
    }
  }, [duel, navigate]);

  const isChallenger = duel?.challengerId === userId;
  const isChallenged = duel?.challengedId === userId;
  const myQuizScore = duel
    ? isChallenger
      ? duel.challengerScore
      : duel.challengedScore
    : null;
  const opponentQuizScore = duel
    ? isChallenger
      ? duel.challengedScore
      : duel.challengerScore
    : null;

  const canPlay = Boolean(
    duel &&
      !duel.isExpired &&
      !quizFullyCompleted &&
      duel.quizId &&
      ((duel.challengerId === userId &&
        (duel.status === 'pending' || duel.status === 'accepted') &&
        duel.challengerScore === null) ||
        (duel.challengedId === userId &&
          duel.status === 'accepted' &&
          duel.challengedScore === null)),
  );

  const bothPlayed = Boolean(
    duel && myQuizScore !== null && opponentQuizScore !== null && isDuelResultReady(duel),
  );
  const showResultCta = Boolean(duel && isDuelResultReady(duel) && !bothPlayed);
  const showAcceptDecline = Boolean(
    duel &&
      (duel.phase === 'needs_your_acceptance' ||
        (isChallenged && duel.status === 'pending')) &&
      !duel.isExpired,
  );

  const onRespond = async (accept: boolean) => {
    if (!duel || !userId || busy) return;
    setBusy(true);
    try {
      const result = await respondToDuel(duel.id, userId, accept);
      await queryClient.invalidateQueries({ queryKey: ['duel', duel.id] });
      await queryClient.invalidateQueries({ queryKey: ['duels-pending'] });
      if (result.queued) {
        notifyUser(
          'Duel',
          accept
            ? 'Acceptation enregistrée — le duel sera disponible à la reconnexion.'
            : 'Refus enregistré — synchronisation à la reconnexion.',
        );
        return;
      }
      if (accept) {
        notifyUser('Défi accepté', `Le duel contre ${duel.challengerName} est lancé. Bonne chance !`);
        await refetch();
      } else {
        notifyUser('Défi refusé', `${duel.challengerName} sera notifié de votre refus.`);
        navigate(DefisRoutes.duelHub);
      }
    } catch (err) {
      showAppError(err instanceof Error ? err.message : 'Une erreur est survenue.', {
        title: 'Duel',
        onRetry: () => void onRespond(accept),
      });
    } finally {
      setBusy(false);
    }
  };

  if ((isLoading && !duel) || !duelId) {
    return (
      <div className="defis-page defis-page--shell">
        <DefisNavbar title="Duel" onBack={() => navigate(DefisRoutes.duelHub)} />
        <div className="duel-hub-loader" role="status" aria-label="Chargement">
          <div className="defis-spinner is-primary" />
        </div>
      </div>
    );
  }

  if (!duel) {
    return (
      <div className="defis-page defis-page--shell">
        <DefisNavbar title="Duel" onBack={() => navigate(DefisRoutes.duelHub)} />
        <p className="duel-friends-empty">Duel introuvable.</p>
      </div>
    );
  }

  const opponentName = isChallenger ? duel.challengedName : duel.challengerName;
  const opponentUserId = isChallenger ? duel.challengedId : duel.challengerId;
  const myName =
    me?.profile?.full_name?.trim() || me?.profile?.username?.trim() || 'Vous';
  const myTotalScore = isChallenger ? duel.challengerTotalScore : duel.challengedTotalScore;
  const opponentTotalScore = isChallenger ? duel.challengedTotalScore : duel.challengerTotalScore;
  const myAvatar = isChallenger ? duel.challengerAvatarUrl : duel.challengedAvatarUrl;
  const opponentAvatar = isChallenger ? duel.challengedAvatarUrl : duel.challengerAvatarUrl;

  const ui = getDuelUiState({
    status: duel.status,
    isExpired: duel.isExpired,
    isChallenger,
    isChallenged,
    myScore: myQuizScore,
    opponentScore: opponentQuizScore,
    opponentName,
  });

  return (
    <div className="defis-page defis-page--shell duel-detail-page">
      <DefisNavbar title="Duel" onBack={() => navigate(DefisRoutes.duelHub)} />

      <div className="duel-detail-board">
        <DuelMatchHero
          myName={myName}
          myUserId={userId}
          myAvatarUrl={myAvatar ?? me?.profile?.avatar_url}
          myTotalScore={myTotalScore}
          opponentName={opponentName}
          opponentUserId={opponentUserId}
          opponentAvatarUrl={opponentAvatar}
          opponentTotalScore={opponentTotalScore}
          myQuizScore={myQuizScore}
          showOpponentQuizScore={bothPlayed || duel.status === 'completed'}
          revealScores={
            bothPlayed ||
            duel.status === 'completed' ||
            duel.isExpired ||
            duel.status === 'expired' ||
            opponentQuizScore !== null
          }
          opponentQuizScore={opponentQuizScore}
          questionsCount={duel.questionsCount}
          expiresAt={duel.expiresAt}
          isExpired={duel.isExpired}
          statusLabel={ui.statusLabel}
          motivationalLine={ui.motivationalLine}
        />

        <section className="duel-detail-rules">
          <SectionTitle title="Règles & conseils" />
          <div className="duel-detail-tips">
            {ui.tips.map((tip) => (
              <p key={tip} className="duel-detail-tip">
                <span aria-hidden>✦</span>
                {tip}
              </p>
            ))}
          </div>
        </section>
      </div>

      {canPlay ? (
        <div className="duel-detail-cta-wrap">
          <button
            type="button"
            className="duel-detail-play"
            onClick={() => navigate(buildQuizEntryHref(duel.quizId, { duelId: duel.id }))}
          >
            <span aria-hidden>🎮</span>
            Jouer mes questions
            <span aria-hidden>→</span>
          </button>
          <p className="duel-detail-cta-hint">Prêt ? Chaque seconde compte !</p>
        </div>
      ) : null}

      {!canPlay && !duel.isExpired && quizFullyCompleted && myQuizScore === null ? (
        <div className="duel-detail-banner is-expired">
          Vous avez déjà terminé ce quiz. Il n’est pas rejouable en duel.
        </div>
      ) : null}

      {showResultCta ? (
        <button
          type="button"
          className="duel-detail-result"
          onClick={() => navigate(DefisRoutes.duelResult(duel.id))}
        >
          Voir le résultat →
        </button>
      ) : null}

      {showAcceptDecline ? (
        <div className="duel-detail-respond">
          <button
            type="button"
            className="duel-detail-accept"
            disabled={busy}
            onClick={() => void onRespond(true)}
          >
            {busy ? '…' : 'Accepter'}
          </button>
          <button
            type="button"
            className="duel-detail-decline"
            disabled={busy}
            onClick={() => void onRespond(false)}
          >
            Refuser
          </button>
        </div>
      ) : null}

      {duel.status === 'declined' ? (
        <div className="duel-detail-banner is-declined">Ce défi a été refusé.</div>
      ) : null}

      {duel.isExpired ? (
        <div className="duel-detail-banner is-expired">
          Ce duel a expiré. Retrouvez-le dans « Mes duels récents ».
        </div>
      ) : null}

      {isChallenged && duel.status === 'pending' && !duel.isExpired && !showAcceptDecline ? (
        <div className="duel-detail-banner is-wait">
          Acceptez d’abord le défi depuis la section « Duels en attente » pour jouer.
        </div>
      ) : null}

      {isChallenger && duel.status === 'pending' && !duel.isExpired && !canPlay ? (
        <div className="duel-detail-banner is-wait">
          En attente que {opponentName} accepte le défi.
        </div>
      ) : null}
    </div>
  );
}
