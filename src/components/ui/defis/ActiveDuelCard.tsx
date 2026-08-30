import { CountdownTimer } from '@components/ui/defis/CountdownTimer';
import type { DuelSummary } from '@app-types/challenge.types';

function getActiveDuelLabel(duel: DuelSummary, userId: string): string {
  const opponent = duel.challengerId === userId ? duel.challengedName : duel.challengerName;

  if (duel.phase === 'expired' || duel.isExpired) {
    return `Duel expiré vs ${opponent}`;
  }

  switch (duel.phase) {
    case 'needs_your_acceptance':
      return `${duel.challengerName} vous a défié`;
    case 'waiting_opponent_acceptance':
      return `En attente que ${opponent} accepte`;
    case 'your_turn':
      return `À vous de jouer vs ${opponent}`;
    case 'waiting_opponent_play':
      return `En attente de ${opponent}`;
    default:
      return `Duel vs ${opponent}`;
  }
}

function getActiveDuelMeta(duel: DuelSummary, userId: string): string {
  const isChallenger = duel.challengerId === userId;
  const myScore = isChallenger ? duel.challengerScore : duel.challengedScore;

  if (duel.phase === 'expired' || duel.isExpired) {
    return myScore === null
      ? 'Délai dépassé · Vous n’avez pas joué'
      : 'Délai dépassé · Partie non terminée';
  }

  if (duel.phase === 'needs_your_acceptance') {
    return `${duel.questionsCount} questions · 30 min pour accepter`;
  }
  if (duel.phase === 'waiting_opponent_acceptance') {
    return myScore !== null
      ? `Score envoyé (${myScore} pts) · En attente d’acceptation`
      : `${duel.questionsCount} questions · Défi envoyé`;
  }
  if (duel.phase === 'your_turn') {
    return `${duel.questionsCount} questions · Lancez votre partie`;
  }
  if (duel.phase === 'waiting_opponent_play') {
    return `Votre score : ${myScore ?? 0} pts · Adversaire n’a pas encore joué`;
  }
  return `${duel.questionsCount} questions`;
}

interface ActiveDuelCardProps {
  duel: DuelSummary;
  userId: string;
  busy: boolean;
  onRespond: (duelId: string, accept: boolean, challengerName: string) => void;
  onOpen: () => void;
}

export function ActiveDuelCard({ duel, userId, busy, onRespond, onOpen }: ActiveDuelCardProps) {
  const title = getActiveDuelLabel(duel, userId);
  const meta = getActiveDuelMeta(duel, userId);
  const showAcceptDecline = duel.phase === 'needs_your_acceptance' && !duel.isExpired;
  const showPlay =
    !duel.isExpired &&
    (duel.phase === 'your_turn' || duel.phase === 'waiting_opponent_acceptance');

  return (
    <article className="active-duel-card">
      <button type="button" className="active-duel-card-main" onClick={onOpen}>
        <strong className="active-duel-card-title">{title}</strong>
        <span className="active-duel-card-meta">{meta}</span>
        {!duel.isExpired ? (
          <CountdownTimer endsAt={duel.expiresAt} className="active-duel-card-timer" />
        ) : null}
      </button>

      {showAcceptDecline ? (
        <div className="active-duel-card-actions">
          <button
            type="button"
            className="active-duel-card-accept"
            disabled={busy}
            onClick={() => onRespond(duel.id, true, duel.challengerName)}
          >
            {busy ? '…' : 'Accepter'}
          </button>
          <button
            type="button"
            className="active-duel-card-decline"
            disabled={busy}
            onClick={() => onRespond(duel.id, false, duel.challengerName)}
          >
            Refuser
          </button>
        </div>
      ) : null}

      {showPlay ? (
        <button type="button" className="active-duel-card-play" onClick={onOpen}>
          {duel.phase === 'your_turn' ? 'Jouer maintenant →' : 'Voir le duel →'}
        </button>
      ) : null}

      {duel.phase === 'waiting_opponent_play' ? (
        <p className="active-duel-card-hint">Vous serez notifié quand l’adversaire aura joué.</p>
      ) : null}
    </article>
  );
}
