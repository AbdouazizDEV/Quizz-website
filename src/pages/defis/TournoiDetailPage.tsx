import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { CompetitionHeroBanner } from '@components/ui/defis/CompetitionHeroBanner';
import { DefisNavbar } from '@components/ui/defis/DefisNavbar';
import { DefisSurfaceCard } from '@components/ui/defis/DefisSurfaceCard';
import { DefisRoutes } from '@constants/defisRoutes';
import { useAuthMe } from '@hooks/useAuthMe';
import { useNetworkStatus } from '@hooks/useNetworkStatus';
import { notifyUser } from '@platform/notify';
import { useAppError } from '@providers/AppErrorProvider';
import {
  fetchCompetitionById,
  drawCompetitionMatch,
  registerForCompetition,
  unregisterFromCompetition,
} from '@services/defis/competitionRepository';
import { buildQuizEntryHref } from '@constants/Routes';
import { resolveEffectiveCompetitionStatus } from '@utils/defis/competitionDisplay';

export function TournoiDetailPage() {
  const { id } = useParams();
  const competitionId = id?.trim() ?? '';
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { data: me } = useAuthMe();
  const userId = me?.user?.id ?? '';
  const { isOnline } = useNetworkStatus();
  const { showAppError } = useAppError();
  const [busy, setBusy] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['competition', competitionId, userId],
    queryFn: () => fetchCompetitionById(competitionId, userId),
    enabled: Boolean(competitionId && userId),
  });

  useEffect(() => {
    if (!competitionId || !userId) return;
    void refetch();
  }, [competitionId, location.pathname, refetch, userId]);

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['competition', competitionId] });
    await queryClient.invalidateQueries({ queryKey: ['competitions'] });
    await queryClient.invalidateQueries({ queryKey: ['defis-dashboard'] });
  };

  const onRegister = async () => {
    if (!userId || !competitionId || busy) return;
    setBusy(true);
    try {
      const result = await registerForCompetition(userId, competitionId);
      await refresh();
      notifyUser(
        'Tournoi',
        result.queued
          ? '✓ Inscription enregistrée — synchronisation à la reconnexion.'
          : '✓ Vous êtes inscrit !',
      );
    } catch (registerError) {
      showAppError(
        registerError instanceof Error ? registerError.message : 'Inscription impossible.',
        { title: 'Tournoi' },
      );
    } finally {
      setBusy(false);
    }
  };

  const onUnregister = async () => {
    if (!userId || !competitionId || busy) return;
    const confirmed = window.confirm('Voulez-vous vraiment vous désinscrire de ce tournoi ?');
    if (!confirmed) return;
    setBusy(true);
    try {
      const result = await unregisterFromCompetition(userId, competitionId);
      await refresh();
      notifyUser(
        'Tournoi',
        result.queued
          ? '✓ Désinscription enregistrée — synchronisation à la reconnexion.'
          : 'Vous n’êtes plus inscrit.',
      );
    } catch (unregisterError) {
      showAppError(
        unregisterError instanceof Error ? unregisterError.message : 'Désinscription impossible.',
        { title: 'Tournoi' },
      );
    } finally {
      setBusy(false);
    }
  };

  const onPlayMatch = async () => {
    if (!userId || !competitionId || busy) return;
    setBusy(true);
    try {
      const draw = await drawCompetitionMatch(competitionId);
      notifyUser(
        'Tournoi',
        `Match ${draw.phase ?? ''} · ${draw.questionsCount} questions tirées`,
      );
      navigate(
        buildQuizEntryHref(draw.quizId, {
          competitionId,
          matchId: draw.matchId,
        }),
      );
    } catch (playError) {
      const message =
        playError instanceof Error ? playError.message : 'Impossible de démarrer le match.';
      if (/déjà joué|attendez|bracket/i.test(message)) {
        notifyUser('Tournoi', message);
        navigate(DefisRoutes.tournoiBracket(competitionId));
      } else {
        showAppError(message, { title: 'Tournoi' });
      }
    } finally {
      setBusy(false);
    }
  };

  if (isLoading) {
    return (
      <div className="defis-page defis-page--shell">
        <DefisNavbar title="Tournoi" onBack={() => navigate(DefisRoutes.tournoiList)} />
        <div className="tournoi-list-loader" role="status" aria-label="Chargement">
          <div className="defis-spinner is-primary" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="defis-page defis-page--shell">
        <DefisNavbar title="Tournoi" onBack={() => navigate(DefisRoutes.tournoiList)} />
        <p className="tournoi-list-empty">
          {error instanceof Error ? error.message : 'Impossible de charger ce tournoi.'}
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="defis-page defis-page--shell">
        <DefisNavbar title="Tournoi" onBack={() => navigate(DefisRoutes.tournoiList)} />
        <p className="tournoi-list-empty">Tournoi introuvable.</p>
      </div>
    );
  }

  const effectiveStatus = resolveEffectiveCompetitionStatus(data);
  const isOpen = effectiveStatus === 'scheduled';
  const isLive = effectiveStatus === 'live';
  const isDone = effectiveStatus === 'completed';

  return (
    <div className="defis-page defis-page--shell tournoi-detail-page">
      <DefisNavbar title="Tournoi" onBack={() => navigate(DefisRoutes.tournoiList)} />

      {!isOnline ? (
        <p className="tournoi-offline-hint">
          Données en cache — reconnectez-vous pour actualiser.
        </p>
      ) : null}

      <div className="tournoi-detail-board">
        <CompetitionHeroBanner
          competition={data}
          subtitle={data.categoryName ? `Catégorie · ${data.categoryName}` : 'Toutes catégories'}
        />

        <div className="tournoi-detail-side">
          <DefisSurfaceCard className="tournoi-perks-card">
            <p className="tournoi-perks-title">À savoir</p>
            <p className="tournoi-perk-line">✓ Gratuit · Résultats en direct</p>
            <p className="tournoi-perk-line">✓ Bracket élimination directe</p>
            <p className="tournoi-perk-line">
              {data.rewardText ? `🎁 ${data.rewardText} à gagner` : '🎁 Récompense champion à gagner'}
            </p>
          </DefisSurfaceCard>

          {isOpen && !data.isRegistered ? (
            <button
              type="button"
              className="tournoi-join-cta"
              disabled={busy}
              onClick={() => void onRegister()}
            >
              {busy ? 'Inscription…' : 'Rejoindre le tournoi'}
            </button>
          ) : null}

          {isOpen && data.isRegistered ? (
            <DefisSurfaceCard className="tournoi-registered-card">
              <p className="tournoi-registered-title">✓ Vous êtes inscrit</p>
              <p className="tournoi-registered-hint">
                Le bracket sera disponible dès le lancement du tournoi. Restez prêt !
              </p>
              <button
                type="button"
                className="tournoi-unlink"
                disabled={busy}
                onClick={() => void onUnregister()}
              >
                Se désinscrire
              </button>
            </DefisSurfaceCard>
          ) : null}
        </div>
      </div>

      {isLive ? (
        <>
          <section className="tournoi-match-card">
            <p className="tournoi-match-eyebrow">⚡ Match en cours</p>
            <h3 className="tournoi-match-title">Mon prochain match</h3>
            <p className="tournoi-match-meta">
              Jouez quand vous voulez avant la fin du tournoi. Chaque victoire vous rapproche du
              titre.
            </p>
            <button
              type="button"
              className="tournoi-match-cta"
              disabled={busy}
              onClick={() => void onPlayMatch()}
            >
              {busy ? 'Tirage…' : 'Jouer mon match →'}
            </button>
          </section>
          <button
            type="button"
            className="tournoi-bracket-link"
            onClick={() => navigate(DefisRoutes.tournoiBracket(competitionId))}
          >
            Voir le bracket complet →
          </button>
        </>
      ) : null}

      {isDone ? (
        <button
          type="button"
          className="tournoi-bracket-link"
          onClick={() => navigate(DefisRoutes.tournoiBracket(competitionId))}
        >
          Voir le podium & le bracket final →
        </button>
      ) : null}
    </div>
  );
}
