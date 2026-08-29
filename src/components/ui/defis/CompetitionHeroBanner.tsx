import type { CompetitionSummary } from '@app-types/challenge.types';
import { formatShortDate } from '@utils/defis/formatDefisTime';

interface CompetitionHeroBannerProps {
  competition: CompetitionSummary;
}

export function CompetitionHeroBanner({ competition }: CompetitionHeroBannerProps) {
  return (
    <section className="defis-arena defis-fade">
      <p className="defis-featured-eyebrow" style={{ color: '#FFB703' }}>
        Tournoi
      </p>
      <h2>{competition.title}</h2>
      <p className="defis-muted" style={{ color: 'rgba(255,255,255,0.75)' }}>
        {formatShortDate(competition.startsAt)} → {formatShortDate(competition.endsAt)}
      </p>
      <p style={{ margin: '10px 0 0', fontWeight: 700 }}>
        {competition.registeredCount}/{competition.maxParticipants} participants
      </p>
    </section>
  );
}
