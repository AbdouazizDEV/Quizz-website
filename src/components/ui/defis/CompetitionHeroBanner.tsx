import { CountdownTimer } from '@components/ui/defis/CountdownTimer';
import type { CompetitionSummary } from '@app-types/challenge.types';

const STATUS_LABELS: Record<CompetitionSummary['status'], string> = {
  draft: 'Brouillon',
  scheduled: 'Inscriptions ouvertes',
  live: 'En cours',
  completed: 'Terminé',
  cancelled: 'Annulé',
};

interface CompetitionHeroBannerProps {
  competition: Pick<
    CompetitionSummary,
    'title' | 'status' | 'registeredCount' | 'maxParticipants' | 'rewardText' | 'startsAt' | 'endsAt'
  >;
  subtitle?: string;
}

export function CompetitionHeroBanner({ competition, subtitle }: CompetitionHeroBannerProps) {
  const countdownTarget =
    competition.status === 'scheduled'
      ? competition.startsAt
      : competition.status === 'live'
        ? competition.endsAt
        : null;

  return (
    <section className="competition-hero defis-fade" aria-label={competition.title}>
      <div className="competition-hero-top">
        <span className="competition-hero-trophy" aria-hidden>
          🏆
        </span>
        <span className="competition-hero-pill">{STATUS_LABELS[competition.status]}</span>
      </div>

      <h2 className="competition-hero-title">{competition.title}</h2>
      {subtitle ? <p className="competition-hero-subtitle">{subtitle}</p> : null}

      <div className="competition-hero-stats">
        <div className="competition-hero-stat">
          <strong>
            {competition.registeredCount}/{competition.maxParticipants}
          </strong>
          <span>Inscrits</span>
        </div>
        <div className="competition-hero-stat">
          <strong>⚔️</strong>
          <span>Élim. directe</span>
        </div>
        {competition.rewardText ? (
          <div className="competition-hero-stat is-wide">
            <strong>🎁 {competition.rewardText}</strong>
            <span>Récompense</span>
          </div>
        ) : null}
      </div>

      {countdownTarget ? (
        <div className="competition-hero-countdown">
          <p className="competition-hero-countdown-label">
            {competition.status === 'scheduled' ? 'Début dans' : 'Se termine dans'}
          </p>
          <CountdownTimer endsAt={countdownTarget} light showPrefix={false} />
        </div>
      ) : null}
    </section>
  );
}
