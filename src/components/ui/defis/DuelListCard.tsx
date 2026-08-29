import type { DuelSummary } from '@app-types/challenge.types';
import { getUserAvatarUri } from '@utils/getUserAvatarUri';
import { duelPhaseLabel } from '@utils/defis/duelLabels';

interface DuelListCardProps {
  duel: DuelSummary;
  userId: string;
  onPress: () => void;
}

export function DuelListCard({ duel, userId, onPress }: DuelListCardProps) {
  const opponentId = duel.challengerId === userId ? duel.challengedId : duel.challengerId;
  const opponentName = duel.challengerId === userId ? duel.challengedName : duel.challengerName;
  const opponentAvatar =
    duel.challengerId === userId ? duel.challengedAvatarUrl : duel.challengerAvatarUrl;
  return (
    <button type="button" className="defis-card defis-fade" onClick={onPress}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <span className="defis-avatar" style={{ width: 44, height: 44, margin: 0 }}>
          <img src={getUserAvatarUri(opponentId, opponentAvatar)} alt="" />
        </span>
        <span style={{ flex: 1, textAlign: 'left' }}>
          <strong className="defis-card-title" style={{ fontSize: 15 }}>
            vs {opponentName}
          </strong>
          <p className="defis-card-meta">{duelPhaseLabel(duel.phase)}</p>
        </span>
      </div>
    </button>
  );
}
