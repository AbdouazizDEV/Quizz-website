interface CoverPhotoChangeModalProps {
  open: boolean;
  busy?: boolean;
  onClose: () => void;
  onPick: () => void;
}

export function CoverPhotoChangeModal({ open, busy, onClose, onPick }: CoverPhotoChangeModalProps) {
  if (!open) return null;

  return (
    <div className="profile-modal-overlay" role="dialog" aria-modal>
      <div className="profile-modal">
        <h2 style={{ margin: 0 }}>Photo de couverture</h2>
        <p className="gains-footnote">Choisis une image pour mettre à jour ta bannière.</p>
        <button type="button" style={{ background: '#FFB703' }} disabled={busy} onClick={onPick}>
          {busy ? 'Envoi…' : 'Choisir une photo'}
        </button>
        <button type="button" style={{ background: '#F3F4F6' }} onClick={onClose}>
          Annuler
        </button>
      </div>
    </div>
  );
}
