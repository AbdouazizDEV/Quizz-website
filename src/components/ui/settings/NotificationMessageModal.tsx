import type { AppNotification } from '@app-types/notification.types';
import { Icon } from '@components/ui/Icon';
import {
  formatNotificationTime,
  getNotificationVisual,
} from '@services/notifications/notificationPresentation';

interface NotificationMessageModalProps {
  item: AppNotification | null;
  onClose: () => void;
}

export function NotificationMessageModal({ item, onClose }: NotificationMessageModalProps) {
  if (!item) return null;
  const visual = getNotificationVisual(item.type);

  return (
    <div
      className="settings-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notif-msg-title"
      onClick={onClose}
    >
      <div className="settings-modal-card settings-notif-message" onClick={(event) => event.stopPropagation()}>
        <span className="settings-notif-icon is-lg" style={{ background: visual.iconBackground }}>
          <Icon name={visual.icon} size={22} color={visual.iconColor} />
        </span>
        <h2 id="notif-msg-title">{item.title}</h2>
        <time>{formatNotificationTime(item.createdAt)}</time>
        <p>{item.body?.trim() || 'Aucun contenu.'}</p>
        <button type="button" className="settings-save" onClick={onClose}>
          Fermer
        </button>
      </div>
    </div>
  );
}
