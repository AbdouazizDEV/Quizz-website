import { CountdownTimer } from '@components/ui/defis/CountdownTimer';

interface DuelIncomingModalProps {
  open: boolean;
  challengerName: string;
  questionsCount: number;
  expiresAt: string;
  busy?: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onClose: () => void;
}

export function DuelIncomingModal({
  open,
  challengerName,
  questionsCount,
  expiresAt,
  busy,
  onAccept,
  onDecline,
  onClose,
}: DuelIncomingModalProps) {
  if (!open) return null;

  return (
    <div className="duel-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="duel-incoming-title">
      <div className="duel-modal-card">
        <div className="duel-modal-icon" aria-hidden>
          🎯
        </div>
        <h2 id="duel-incoming-title" className="duel-modal-title">
          Nouveau défi reçu !
        </h2>
        <p className="duel-modal-body">
          <strong>{challengerName}</strong> vous a défié. Consultez les détails ci-dessous et
          acceptez pour commencer la partie.
        </p>
        <div className="duel-modal-meta">
          <p>📋 {questionsCount} questions</p>
          <CountdownTimer endsAt={expiresAt} />
        </div>
        <div className="duel-modal-actions is-row">
          <button type="button" className="duel-modal-secondary" disabled={busy} onClick={onDecline}>
            Refuser
          </button>
          <button type="button" className="duel-modal-primary" disabled={busy} onClick={onAccept}>
            Accepter →
          </button>
        </div>
        <button type="button" className="duel-modal-later" onClick={onClose}>
          Répondre plus tard
        </button>
      </div>
    </div>
  );
}
