import type { ChallengeProgress } from '@app-types/challenge.types';
import { formatEndsIn } from '@utils/defis/formatDefisTime';

interface ChallengeCompetitionHeroProps {
  progress: ChallengeProgress;
}

export function ChallengeCompetitionHero({ progress }: ChallengeCompetitionHeroProps) {
  const { challenge, userRank, userScore, quizzesPlayed, totalQuizzes } = progress;
  const ratio = totalQuizzes > 0 ? Math.min(1, quizzesPlayed / totalQuizzes) : 0;
  return (
    <section className="defis-hero defis-fade">
      <p className="defis-featured-eyebrow">{challenge.type || 'Challenge'}</p>
      <h2>{challenge.title}</h2>
      <p className="defis-featured-meta">{formatEndsIn(challenge.endsAt)}</p>
      <p className="defis-featured-hint">{challenge.rewardText || 'Récompenses à gagner'}</p>
      <div className="defis-hero-metrics">
        <div className="defis-hero-metric">
          <b>{userRank ? `#${userRank}` : '—'}</b>
          <span>Rang</span>
        </div>
        <div className="defis-hero-metric">
          <b>{userScore}</b>
          <span>Score</span>
        </div>
        <div className="defis-hero-metric">
          <b>
            {quizzesPlayed}/{totalQuizzes}
          </b>
          <span>Missions</span>
        </div>
      </div>
      <div className="defis-progress" aria-hidden>
        <span style={{ width: `${Math.round(ratio * 100)}%` }} />
      </div>
    </section>
  );
}
