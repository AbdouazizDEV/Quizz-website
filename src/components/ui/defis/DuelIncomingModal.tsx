interface DuelIncomingModalProps {
  open: boolean;
  challengerName: string;
  busy?: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onClose: () => void;
}

export function DuelIncomingModal({
  open,
  challengerName,
  busy,
  onAccept,
  onDecline,
  onClose,
}: DuelIncomingModalProps) {
  if (!open) return null;
  return (
    <div className="defis-modal-overlay" role="dialog" aria-modal="true">
      <div className="defis-modal">
        <h2 className="defis-card-title">Nouveau duel</h2>
        <p className="defis-muted">{challengerName} te défie. Tu acceptes ?</p>
        <button type="button" className="defis-cta defis-cta-primary" disabled={busy} onClick={onAccept}>
          Accepter
        </button>
        <button type="button" className="defis-cta defis-cta-ghost" disabled={busy} onClick={onDecline}>
          Refuser
        </button>
        <button type="button" className="defis-link" onClick={onClose}>
          Plus tard
        </button>
      </div>
    </div>
  );
}
