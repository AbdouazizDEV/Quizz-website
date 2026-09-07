import type { CompetitionSummary } from '@app-types/challenge.types';
import {
  canRegisterForCompetition,
  getCompetitionStatusLabel,
  resolveEffectiveCompetitionStatus,
} from '@utils/defis/competitionDisplay';

interface TournoiCardProps {
  competition: CompetitionSummary;
  index: number;
  onPress: () => void;
  onRegister: () => void;
  registering?: boolean;
}

function formatTournoiDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function TournoiCard({
  competition,
  index,
  onPress,
  onRegister,
  registering = false,
}: TournoiCardProps) {
  const fillRatio = competition.maxParticipants
    ? competition.registeredCount / competition.maxParticipants
    : 0;
  const isFull = competition.registeredCount >= competition.maxParticipants;
  const effectiveStatus = resolveEffectiveCompetitionStatus(competition);
  const canRegister = canRegisterForCompetition(competition);
  const statusLabel = getCompetitionStatusLabel(competition);
  const delayClass = `defis-fade-d${Math.min(5, (index % 5) + 1)}`;

  return (
    <article className={`tournoi-card defis-fade ${delayClass}`}>
      <span className="tournoi-card-accent" aria-hidden />
      <div className="tournoi-card-main">
        <button type="button" className="tournoi-card-hit" onClick={onPress}>
          <span className="tournoi-card-top">
            <h3 className="tournoi-card-title">{competition.title}</h3>
            <span className="tournoi-card-pill">{statusLabel}</span>
          </span>

          <span className="tournoi-card-meta">
            {competition.categoryName?.trim() || 'Toutes catégories'}
          </span>

          <span className="tournoi-card-participants">
            <span>👥 Participants</span>
            <strong>
              {competition.registeredCount} / {competition.maxParticipants}
              {isFull ? ' · Complet' : ''}
            </strong>
          </span>

          <span className="tournoi-card-track" aria-hidden>
            <span
              className="tournoi-card-fill"
              style={{ width: `${Math.min(100, Math.max(0, fillRatio * 100))}%` }}
            />
          </span>

          {competition.startsAt ? (
            <span className="tournoi-card-date">
              📅 {effectiveStatus === 'scheduled' ? "Inscriptions jusqu'au" : 'Commence le'}{' '}
              {formatTournoiDate(competition.startsAt)}
            </span>
          ) : null}

          {competition.rewardText ? (
            <span className="tournoi-card-reward">🎁 {competition.rewardText}</span>
          ) : null}
        </button>

        {canRegister ? (
          <div className="tournoi-card-actions">
            <button
              type="button"
              className="tournoi-card-cta"
              disabled={registering}
              onClick={onRegister}
            >
              {registering ? 'Inscription…' : 'Rejoindre →'}
            </button>
          </div>
        ) : null}

        {competition.isRegistered && effectiveStatus === 'scheduled' ? (
          <p className="tournoi-card-registered">✓ Inscrit — bonne chance !</p>
        ) : null}
      </div>
    </article>
  );
}
