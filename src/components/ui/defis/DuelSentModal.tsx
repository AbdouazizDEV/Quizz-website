interface DuelSentModalProps {
  open: boolean;
  opponentName: string;
  onClose: () => void;
}

export function DuelSentModal({ open, opponentName, onClose }: DuelSentModalProps) {
  if (!open) return null;
  return (
    <div className="defis-modal-overlay" role="dialog" aria-modal="true">
      <div className="defis-modal">
        <h2 className="defis-card-title">Duel envoyé</h2>
        <p className="defis-muted">
          Le défi a été envoyé à {opponentName}. Tu seras notifié dès qu’il accepte.
        </p>
        <button type="button" className="defis-cta defis-cta-primary" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}
