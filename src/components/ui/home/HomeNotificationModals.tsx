import type { AppNotification } from '@app-types/notification.types';

interface NotificationMessageModalProps {
  item: AppNotification | null;
  onClose: () => void;
}

export function NotificationMessageModal({ item, onClose }: NotificationMessageModalProps) {
  if (!item) return null;
  return (
    <div className="home-overlay" role="dialog" aria-modal="true">
      <button type="button" className="home-backdrop" aria-label="Fermer" onClick={onClose} />
      <div className="home-modal">
        <h3>{item.title}</h3>
        <p>{item.body ?? ''}</p>
        <div className="home-modal-actions">
          <button type="button" className="home-rewards-btn" style={{ background: '#212121' }} onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

interface NotificationDeleteConfirmModalProps {
  item: AppNotification | null;
  busy: boolean;
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
    <div className="home-overlay" role="dialog" aria-modal="true">
      <button type="button" className="home-backdrop" aria-label="Annuler" onClick={onCancel} />
      <div className="home-modal">
        <h3>Supprimer la notification</h3>
        <p>Supprimer « {item.title} » ? Cette action est définitive.</p>
        <div className="home-modal-actions">
          <button type="button" className="home-notif-reject" onClick={onCancel} disabled={busy}>
            Annuler
          </button>
          <button type="button" className="home-notif-accept" onClick={onConfirm} disabled={busy}>
            {busy ? '…' : 'Supprimer'}
          </button>
        </div>
      </div>
    </div>
  );
}
