import type { AppNotification } from '@app-types/notification.types';

interface NotificationDeleteConfirmModalProps {
  item: AppNotification | null;
  busy?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function NotificationDeleteConfirmModal({
  item,
  busy,
  onCancel,
  onConfirm,
}: NotificationDeleteConfirmModalProps) {
  if (!item) return null;

  return (
    <div
      className="settings-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notif-del-title"
      onClick={busy ? undefined : onCancel}
    >
      <div className="settings-modal-card" onClick={(event) => event.stopPropagation()}>
        <h2 id="notif-del-title">Supprimer cette notification ?</h2>
        <p>{item.title}</p>
        <div className="settings-modal-actions">
          <button type="button" className="settings-modal-secondary" disabled={busy} onClick={onCancel}>
            Annuler
          </button>
          <button type="button" className="settings-modal-danger" disabled={busy} onClick={onConfirm}>
            {busy ? '…' : 'Supprimer'}
          </button>
        </div>
      </div>
    </div>
  );
}
