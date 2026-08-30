import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import { DefisNavbar } from '@components/ui/defis/DefisNavbar';
import { DuelMatchHero } from '@components/ui/defis/DuelMatchHero';
import { DefisRoutes } from '@constants/defisRoutes';
import { Routes } from '@constants/Routes';
import { useAuthMe } from '@hooks/useAuthMe';
import { isDuelResultReady, useDuelQuery } from '@hooks/defis/useDuelQuery';
import { resolveDuelOutcome } from '@utils/defis/resolveDuelOutcome';

function buildHeadline(tone: ReturnType<typeof resolveDuelOutcome>['tone']): string {
  switch (tone) {
    case 'victory':
      return '🎉 Victoire !';
    case 'defeat':
      return 'Bien joué !';
    case 'draw':
      return '⚖️ Égalité !';
    case 'expired':
      return '⏱ Duel expiré';
    default:
      return 'Défi refusé';
  }
}

export function DuelResultPage() {
  const { id } = useParams();
  const duelId = id?.trim() ?? '';
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: me } = useAuthMe();
  const userId = me?.user?.id ?? '';

  const { data: duel, isPending, isFetching, isError, error, refetch } = useDuelQuery(duelId);
  const showInitialLoader = Boolean(duelId) && isPending && !duel;

  useEffect(() => {
    if (duel && !isDuelResultReady(duel)) {
      navigate(DefisRoutes.duelDetail(duel.id), { replace: true });
    }
  }, [duel, navigate]);

  if (!duelId) {
    return (
      <div className="defis-page defis-page--shell">
        <DefisNavbar title="Résultat" onBack={() => navigate(DefisRoutes.duelHub)} />
        <div className="duel-result-empty">
          <strong>Lien invalide</strong>
          <button
            type="button"
            className="duel-result-primary"
            onClick={() => navigate(DefisRoutes.duelHub)}
          >
            Retour aux duels
          </button>
        </div>
      </div>
    );
  }

  if (showInitialLoader) {
    return (
      <div className="defis-page defis-page--shell">
        <DefisNavbar title="Résultat" onBack={() => navigate(DefisRoutes.duelHub)} />
        <div className="duel-result-loader">
          <div className="defis-spinner is-primary" />
          <p>Chargement du résultat…</p>
        </div>
      </div>
    );
  }

  if (isError || !duel) {
    return (
      <div className="defis-page defis-page--shell">
        <DefisNavbar title="Résultat" onBack={() => navigate(DefisRoutes.duelHub)} />
        <div className="duel-result-empty">
          <strong>Résultat indisponible</strong>
          <p>{error instanceof Error ? error.message : 'Impossible de charger ce duel.'}</p>
          <button
            type="button"
            className="duel-result-primary"
            onClick={() => {
              void queryClient.invalidateQueries({ queryKey: ['duel', duelId] });
              void refetch();
            }}
          >
            Réessayer
          </button>
          <button
            type="button"
            className="duel-result-secondary"
            onClick={() => navigate(DefisRoutes.duelHub)}
          >
            Retour aux duels
          </button>
        </div>
      </div>
    );
  }

  if (!isDuelResultReady(duel)) {
    return (
      <div className="defis-page defis-page--shell">
        <DefisNavbar title="Résultat" onBack={() => navigate(DefisRoutes.duelHub)} />
        <div className="duel-result-loader">
          <div className="defis-spinner is-primary" />
          <p>Redirection vers le duel…</p>
        </div>
      </div>
    );
  }

  const isChallenger = duel.challengerId === userId;
  const myQuizScoreRaw = isChallenger ? duel.challengerScore : duel.challengedScore;
  const opponentQuizScoreRaw = isChallenger ? duel.challengedScore : duel.challengerScore;
  const myQuizScore = myQuizScoreRaw ?? 0;
  const opponentQuizScore = opponentQuizScoreRaw ?? 0;
  const opponentName = isChallenger ? duel.challengedName : duel.challengerName;
  const opponentUserId = isChallenger ? duel.challengedId : duel.challengerId;
  const myName = me?.profile?.full_name?.trim() || me?.profile?.username?.trim() || 'Vous';
  const outcome = resolveDuelOutcome(duel, userId);
  const expired = outcome.tone === 'expired';
  const declined = duel.status === 'declined';
  const scoreLine =
    myQuizScoreRaw !== null && opponentQuizScoreRaw !== null
      ? `${myQuizScoreRaw} - ${opponentQuizScoreRaw} pts`
      : null;

  const headline = buildHeadline(outcome.tone);
  const subline = expired
    ? scoreLine
      ? `Score final : ${scoreLine}`
      : isChallenger
        ? duel.challengerScore === null
          ? 'Vous n’avez pas joué à temps.'
          : 'L’adversaire n’a pas terminé à temps.'
        : duel.challengedScore === null
          ? 'Vous n’avez pas joué à temps.'
          : opponentQuizScoreRaw !== null
            ? `Adversaire : ${opponentQuizScoreRaw} pts · délai dépassé`
            : 'Le délai est dépassé.'
    : declined
      ? duel.challengedId === userId
        ? 'Vous avez refusé ce défi.'
        : `${opponentName} a refusé votre défi.`
      : outcome.tone === 'victory'
        ? [scoreLine, '+5 pts bonus duel (score quiz déjà compté)'].filter(Boolean).join(' · ')
        : outcome.tone === 'draw'
          ? [scoreLine, 'Égalité, aucun bonus'].filter(Boolean).join(' · ')
          : [scoreLine, 'Score quiz compté dans ton total'].filter(Boolean).join(' · ');

  return (
    <div className="defis-page defis-page--shell duel-result-page">
      <DefisNavbar title="Résultat" onBack={() => navigate(DefisRoutes.duelHub)} />

      {isFetching && duel ? (
        <div className="duel-result-refresh">
          <div className="defis-spinner is-primary" />
          <span>Mise à jour…</span>
        </div>
      ) : null}

      <header className="duel-result-headline">
        <h2 className={expired || declined ? 'is-muted' : undefined}>{headline}</h2>
        <p>{subline}</p>
      </header>

      <DuelMatchHero
        myName={myName}
        myUserId={userId}
        myAvatarUrl={
          (isChallenger ? duel.challengerAvatarUrl : duel.challengedAvatarUrl) ??
          me?.profile?.avatar_url
        }
        myTotalScore={isChallenger ? duel.challengerTotalScore : duel.challengedTotalScore}
        opponentName={opponentName}
        opponentUserId={opponentUserId}
        opponentAvatarUrl={isChallenger ? duel.challengedAvatarUrl : duel.challengerAvatarUrl}
        opponentTotalScore={isChallenger ? duel.challengedTotalScore : duel.challengerTotalScore}
        myQuizScore={myQuizScoreRaw}
        showOpponentQuizScore
        revealScores={!declined}
        opponentQuizScore={opponentQuizScoreRaw}
        questionsCount={duel.questionsCount}
        expiresAt={duel.expiresAt}
        isExpired={expired}
        statusLabel={
          expired
            ? 'Expiré'
            : declined
              ? 'Refusé'
              : outcome.tone === 'victory'
                ? 'Victoire'
                : outcome.tone === 'draw'
                  ? 'Égalité'
                  : 'Résultat'
        }
        motivationalLine={
          declined
            ? 'Aucune partie n’a été jouée pour ce duel.'
            : expired
              ? scoreLine
                ? `${myQuizScoreRaw} vs ${opponentQuizScoreRaw} pts · duel archivé`
                : 'Ce duel est archivé dans vos duels récents.'
              : `${myQuizScoreRaw ?? 0} vs ${opponentQuizScoreRaw ?? 0} pts`
        }
      />

      {!expired && !declined && outcome.lost && opponentQuizScore > myQuizScore ? (
        <p className="duel-result-encourage">
          {opponentName} n’était qu’à {opponentQuizScore - myQuizScore} pt
          {opponentQuizScore - myQuizScore > 1 ? 's' : ''} devant vous !
        </p>
      ) : null}

      <div className="duel-result-actions">
        <button
          type="button"
          className="duel-result-primary"
          onClick={() => navigate(DefisRoutes.duelHub)}
        >
          Nouveau duel →
        </button>
        <button type="button" className="duel-result-secondary" onClick={() => navigate(Routes.HOME)}>
          Accueil
        </button>
      </div>
    </div>
  );
}
