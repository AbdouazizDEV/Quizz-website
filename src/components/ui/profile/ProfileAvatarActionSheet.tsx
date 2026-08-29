interface ProfileAvatarActionSheetProps {
  open: boolean;
  busy?: boolean;
  onClose: () => void;
  onPickGallery: () => void;
  onOpenPersonalInfo?: () => void;
}

export function ProfileAvatarActionSheet({
  open,
  busy,
  onClose,
  onPickGallery,
  onOpenPersonalInfo,
}: ProfileAvatarActionSheetProps) {
  if (!open) return null;

  return (
    <div className="profile-sheet-overlay" role="dialog" aria-modal>
      <div className="profile-sheet">
        <h2 style={{ margin: 0 }}>Avatar</h2>
        <button type="button" style={{ background: '#FFB703' }} disabled={busy} onClick={onPickGallery}>
          {busy ? 'Envoi…' : 'Choisir depuis la galerie'}
        </button>
        {onOpenPersonalInfo ? (
          <button
            type="button"
            style={{ background: '#EEF2FF' }}
            onClick={() => {
              onClose();
              onOpenPersonalInfo();
            }}
          >
            Infos personnelles
          </button>
        ) : null}
        <button type="button" style={{ background: '#F3F4F6' }} onClick={onClose}>
          Annuler
        </button>
      </div>
    </div>
  );
}
