import { CountdownTimer } from '@components/ui/defis/CountdownTimer';
import type { CompetitionSummary } from '@app-types/challenge.types';
import {
  getCompetitionCountdown,
  getCompetitionStatusLabel,
} from '@utils/defis/competitionDisplay';

interface CompetitionHeroBannerProps {
  competition: Pick<
    CompetitionSummary,
    'title' | 'status' | 'registeredCount' | 'maxParticipants' | 'rewardText' | 'startsAt' | 'endsAt'
  >;
  subtitle?: string;
}

export function CompetitionHeroBanner({ competition, subtitle }: CompetitionHeroBannerProps) {
  const statusLabel = getCompetitionStatusLabel(competition);
  const countdown = getCompetitionCountdown(competition);

  return (
    <section className="competition-hero defis-fade" aria-label={competition.title}>
      <div className="competition-hero-top">
        <span className="competition-hero-trophy" aria-hidden>
          🏆
        </span>
        <span className="competition-hero-pill">{statusLabel}</span>
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

      {countdown ? (
        <div className="competition-hero-countdown">
          <p className="competition-hero-countdown-label">{countdown.label}</p>
          <CountdownTimer endsAt={countdown.target} light showPrefix={false} />
        </div>
      ) : null}
    </section>
  );
}
