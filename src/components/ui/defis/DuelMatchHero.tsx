import clsx from 'clsx';

import { CountdownTimer } from '@components/ui/defis/CountdownTimer';
import { getUserAvatarUri } from '@utils/getUserAvatarUri';

interface DuelMatchHeroProps {
  myName: string;
  myUserId: string;
  myAvatarUrl?: string | null;
  myTotalScore: number;
  opponentName: string;
  opponentUserId: string;
  opponentAvatarUrl?: string | null;
  opponentTotalScore: number;
  myQuizScore: number | null;
  showOpponentQuizScore: boolean;
  opponentQuizScore: number | null;
  revealScores?: boolean;
  questionsCount: number;
  expiresAt: string;
  isExpired: boolean;
  statusLabel: string;
  motivationalLine: string;
}

function PlayerColumn({
  label,
  name,
  avatarUri,
  totalScore,
  quizScore,
  highlight = false,
  locked = false,
  revealScores = false,
}: {
  label: string;
  name: string;
  avatarUri: string;
  totalScore: number;
  quizScore: number | null;
  highlight?: boolean;
  locked?: boolean;
  revealScores?: boolean;
}) {
  return (
    <div className={clsx('duel-match-player', highlight && 'is-me')}>
      <span className={clsx('duel-match-avatar-ring', highlight && 'is-highlight')}>
        <img className="duel-match-avatar" src={avatarUri} alt="" />
      </span>
      <span className="duel-match-player-label">{label}</span>
      <strong className="duel-match-player-name">{name}</strong>
      <span className="duel-match-total">{totalScore} pts classement</span>
      {locked ? (
        <span className="duel-match-locked">🔒 Quiz secret</span>
      ) : quizScore !== null ? (
        <span className={clsx('duel-match-quiz-score', highlight && 'is-highlight')}>
          {quizScore} pts quiz
        </span>
      ) : revealScores ? (
        <span className="duel-match-not-played">Non joué</span>
      ) : (
        <span className="duel-match-pending">Quiz · à jouer</span>
      )}
    </div>
  );
}

export function DuelMatchHero({
  myName,
  myUserId,
  myAvatarUrl,
  myTotalScore,
  opponentName,
  opponentUserId,
  opponentAvatarUrl,
  opponentTotalScore,
  myQuizScore,
  showOpponentQuizScore,
  opponentQuizScore,
  revealScores = false,
  questionsCount,
  expiresAt,
  isExpired,
  statusLabel,
  motivationalLine,
}: DuelMatchHeroProps) {
  return (
    <section className={clsx('duel-match-hero', isExpired && 'is-expired')} aria-label="Duel">
      <div className="duel-match-badge-row">
        <span className={clsx('duel-match-badge', isExpired && 'is-expired')}>
          {isExpired ? '⏱ Expiré' : `⚡ ${statusLabel}`}
        </span>
      </div>

      <p className="duel-match-motivation">{motivationalLine}</p>

      <div className="duel-match-versus">
        <PlayerColumn
          label="Vous"
          name={myName}
          avatarUri={getUserAvatarUri(myUserId, myAvatarUrl)}
          totalScore={myTotalScore}
          quizScore={myQuizScore}
          highlight
          revealScores={revealScores}
        />
        <div className="duel-match-vs" aria-hidden>
          VS
        </div>
        <PlayerColumn
          label={opponentName.split(' ')[0] || opponentName}
          name={opponentName}
          avatarUri={getUserAvatarUri(opponentUserId, opponentAvatarUrl)}
          totalScore={opponentTotalScore}
          quizScore={revealScores || showOpponentQuizScore ? opponentQuizScore : null}
          locked={!revealScores && !showOpponentQuizScore && opponentQuizScore === null}
          revealScores={revealScores}
        />
      </div>

      <div className="duel-match-chips">
        <span>📋 {questionsCount} questions</span>
        <span>🏆 Score classement</span>
        <span>⭐ Points quiz du duel</span>
      </div>

      <div className="duel-match-countdown">
        <CountdownTimer endsAt={expiresAt} />
        {isExpired ? (
          <p className="duel-match-expired-hint">
            Ce défi n’est plus disponible. Consultez « Mes duels récents ».
          </p>
        ) : null}
      </div>
    </section>
  );
}
