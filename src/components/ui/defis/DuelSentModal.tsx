import { CountdownTimer } from '@components/ui/defis/CountdownTimer';

interface DuelSentModalProps {
  open: boolean;
  friendName: string;
  questionsCount: number;
  expiresAt: string;
  onPlayNow: () => void;
  onLater: () => void;
}

export function DuelSentModal({
  open,
  friendName,
  questionsCount,
  expiresAt,
  onPlayNow,
  onLater,
}: DuelSentModalProps) {
  if (!open) return null;

  return (
    <div className="duel-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="duel-sent-title">
      <div className="duel-modal-card">
        <div className="duel-modal-icon" aria-hidden>
          ⚡
        </div>
        <h2 id="duel-sent-title" className="duel-modal-title">
          Défi envoyé !
        </h2>
        <p className="duel-modal-body">
          <strong className="is-primary">{friendName}</strong> a bien reçu votre défi. Une
          notification lui a été envoyée avec tous les détails.
        </p>
        <div className="duel-modal-meta">
          <p>📋 {questionsCount} questions</p>
          <CountdownTimer endsAt={expiresAt} />
        </div>
        <p className="duel-modal-hint">
          Vous pouvez jouer vos questions dès maintenant. Votre ami devra accepter le défi pour
          jouer de son côté.
        </p>
        <div className="duel-modal-actions">
          <button type="button" className="duel-modal-secondary" onClick={onLater}>
            Plus tard
          </button>
          <button type="button" className="duel-modal-primary" onClick={onPlayNow}>
            Jouer maintenant →
          </button>
        </div>
      </div>
    </div>
  );
}
