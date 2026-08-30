import clsx from 'clsx';

import type { DuelSummary } from '@app-types/challenge.types';
import { getUserAvatarUri } from '@utils/getUserAvatarUri';
import {
  resolveDuelOutcome,
  type DuelOutcomeTone,
} from '@utils/defis/resolveDuelOutcome';

interface RecentDuelRowProps {
  duel: DuelSummary;
  userId: string;
  onPress: () => void;
}

const TONE_STYLES: Record<
  DuelOutcomeTone,
  { accent: string; badgeBg: string; badgeText: string; pointsBg: string }
> = {
  victory: {
    accent: '#2ECC71',
    badgeBg: 'rgba(46, 204, 113, 0.15)',
    badgeText: '#1E8449',
    pointsBg: 'rgba(46, 204, 113, 0.12)',
  },
  defeat: {
    accent: '#E8431A',
    badgeBg: 'rgba(232, 67, 26, 0.12)',
    badgeText: '#E8431A',
    pointsBg: 'rgba(232, 67, 26, 0.08)',
  },
  draw: {
    accent: '#6B6B7B',
    badgeBg: 'rgba(107, 107, 123, 0.12)',
    badgeText: '#4A4A5E',
    pointsBg: 'rgba(107, 107, 123, 0.1)',
  },
  neutral: {
    accent: '#9CA3AF',
    badgeBg: 'rgba(156, 163, 175, 0.15)',
    badgeText: '#6B7280',
    pointsBg: 'rgba(156, 163, 175, 0.1)',
  },
  expired: {
    accent: '#F5A623',
    badgeBg: 'rgba(245, 166, 35, 0.18)',
    badgeText: '#B7791F',
    pointsBg: 'rgba(245, 166, 35, 0.1)',
  },
};

export function RecentDuelRow({ duel, userId, onPress }: RecentDuelRowProps) {
  const isChallenger = duel.challengerId === userId;
  const opponentName = isChallenger ? duel.challengedName : duel.challengerName;
  const opponentId = isChallenger ? duel.challengedId : duel.challengerId;
  const opponentAvatar = isChallenger ? duel.challengedAvatarUrl : duel.challengerAvatarUrl;
  const outcome = resolveDuelOutcome(duel, userId);
  const tone = TONE_STYLES[outcome.tone];

  const myScore = isChallenger ? duel.challengerScore : duel.challengedScore;
  const oppScore = isChallenger ? duel.challengedScore : duel.challengerScore;
  const hasScores = myScore !== null && oppScore !== null;

  return (
    <button
      type="button"
      className="recent-duel-row"
      style={{ borderLeftColor: tone.accent }}
      onClick={onPress}
    >
      <img
        className="recent-duel-avatar"
        src={getUserAvatarUri(opponentId, opponentAvatar)}
        alt=""
      />

      <div className="recent-duel-body">
        <strong className="recent-duel-name">{opponentName}</strong>

        {hasScores ? (
          <span className="recent-duel-score">
            <b className={clsx(outcome.won && 'is-win')}>{myScore}</b>
            <i>vs</i>
            <b>{oppScore}</b>
          </span>
        ) : (
          <span className="recent-duel-noscore">Match non disputé</span>
        )}

        <span className="recent-duel-badge" style={{ background: tone.badgeBg }}>
          <span aria-hidden>{outcome.icon}</span>
          <span style={{ color: tone.badgeText }}>{outcome.label}</span>
        </span>
      </div>

      <span className="recent-duel-points" style={{ background: tone.pointsBg, color: tone.badgeText }}>
        {outcome.points}
      </span>
    </button>
  );
}
