import type { DuelSummary } from '@app-types/challenge.types';
import { getUserAvatarUri } from '@utils/getUserAvatarUri';
import { duelPhaseLabel } from '@utils/defis/duelLabels';

interface DuelMatchHeroProps {
  duel: DuelSummary;
}

export function DuelMatchHero({ duel }: DuelMatchHeroProps) {
  return (
    <section className="defis-duel-hero defis-fade">
      <div>
        <span className="defis-avatar">
          <img src={getUserAvatarUri(duel.challengerId, duel.challengerAvatarUrl)} alt="" />
        </span>
        <strong>{duel.challengerName}</strong>
        <p className="defis-muted">{duel.challengerScore ?? '—'} pts</p>
      </div>
      <div className="defis-vs">VS</div>
      <div>
        <span className="defis-avatar">
          <img src={getUserAvatarUri(duel.challengedId, duel.challengedAvatarUrl)} alt="" />
        </span>
        <strong>{duel.challengedName}</strong>
        <p className="defis-muted">{duel.challengedScore ?? '—'} pts</p>
      </div>
      <p className="defis-muted" style={{ gridColumn: '1 / -1', marginTop: 8 }}>
        {duelPhaseLabel(duel.phase)} · {duel.questionsCount} questions
      </p>
    </section>
  );
}
