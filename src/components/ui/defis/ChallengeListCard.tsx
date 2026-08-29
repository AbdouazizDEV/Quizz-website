import type { WeeklyChallenge } from '@app-types/challenge.types';
import { formatEndsIn, formatShortDate } from '@utils/defis/formatDefisTime';

interface ChallengeListCardProps {
  challenge: WeeklyChallenge;
  onPress: () => void;
  ctaLabel?: string;
}

export function ChallengeListCard({ challenge, onPress, ctaLabel = 'Voir' }: ChallengeListCardProps) {
  return (
    <button type="button" className="defis-card defis-fade" onClick={onPress}>
      <span className="defis-chip">{challenge.type || 'Hebdomadaire'}</span>
      <h3 className="defis-card-title">{challenge.title}</h3>
      <p className="defis-card-meta">
        {formatShortDate(challenge.startsAt)} → {formatShortDate(challenge.endsAt)}
      </p>
      <p className="defis-card-hint">{formatEndsIn(challenge.endsAt)}</p>
      <p className="defis-card-hint">{challenge.rewardText || 'Récompenses à gagner'}</p>
      <span className="defis-cta defis-cta-primary" style={{ marginTop: 6 }}>
        {ctaLabel}
      </span>
    </button>
  );
}
