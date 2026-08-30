import { useEffect } from 'react';

interface LogoutConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutConfirmModal({ open, onClose, onConfirm }: LogoutConfirmModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="settings-logout-overlay" role="dialog" aria-modal="true" aria-labelledby="logout-title">
      <button type="button" className="settings-logout-backdrop" aria-label="Fermer" onClick={onClose} />
      <div className="settings-logout-sheet">
        <span className="settings-logout-handle" />
        <h2 id="logout-title">Déconnexion</h2>
        <hr className="settings-logout-divider" />
        <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
        <div className="settings-logout-actions">
          <button type="button" className="settings-logout-cancel" onClick={onClose}>
            Annuler
          </button>
          <button type="button" className="settings-logout-confirm" onClick={onConfirm}>
            Oui, me déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}
