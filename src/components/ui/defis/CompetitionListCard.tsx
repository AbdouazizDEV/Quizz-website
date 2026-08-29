import type { CompetitionSummary } from '@app-types/challenge.types';
import { formatShortDate } from '@utils/defis/formatDefisTime';

interface CompetitionListCardProps {
  competition: CompetitionSummary;
  onPress: () => void;
}

function statusLabel(status: CompetitionSummary['status']): string {
  if (status === 'scheduled') return 'Inscriptions';
  if (status === 'live') return 'En cours';
  if (status === 'completed') return 'Terminé';
  return status;
}

export function CompetitionListCard({ competition, onPress }: CompetitionListCardProps) {
  const cta =
    competition.status === 'scheduled'
      ? competition.isRegistered
        ? 'Inscrit'
        : 'Inscrire'
      : 'Voir';
  return (
    <button type="button" className="defis-card defis-fade" onClick={onPress}>
      <span className="defis-chip">{statusLabel(competition.status)}</span>
      <h3 className="defis-card-title">{competition.title}</h3>
      <p className="defis-card-meta">
        {formatShortDate(competition.startsAt)} → {formatShortDate(competition.endsAt)}
      </p>
      <p className="defis-card-hint">
        {competition.registeredCount}/{competition.maxParticipants} inscrits
      </p>
      <p className="defis-card-hint">{competition.rewardText || 'Récompenses à gagner'}</p>
      <span className="defis-cta defis-cta-primary" style={{ marginTop: 6 }}>
        {cta}
      </span>
    </button>
  );
}
