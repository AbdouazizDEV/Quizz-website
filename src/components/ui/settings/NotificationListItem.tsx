import type { AppNotification } from '@app-types/notification.types';
import { Icon } from '@components/ui/Icon';
import { isPendingDuelRequest } from '@services/notifications/duelNotificationHelpers';
import { isNotificationPressable } from '@services/notifications/notificationActions';
import {
  formatNotificationTime,
  getNotificationVisual,
} from '@services/notifications/notificationPresentation';

interface NotificationListItemProps {
  item: AppNotification;
  busy?: boolean;
  onPress: () => void;
  onAcceptFriend?: () => void;
  onRejectFriend?: () => void;
  onAcceptDuel?: () => void;
  onRejectDuel?: () => void;
  onMarkRead?: () => void;
  onDeleteRequest?: () => void;
}

export function NotificationListItem({
  item,
  busy,
  onPress,
  onAcceptFriend,
  onRejectFriend,
  onAcceptDuel,
  onRejectDuel,
  onMarkRead,
  onDeleteRequest,
}: NotificationListItemProps) {
  const visual = getNotificationVisual(item.type);
  const isFriendRequest = item.type === 'friend_request' && !item.isRead;
  const isDuelRequest = isPendingDuelRequest(item);
  const pressable = isNotificationPressable(item);
  const interactive = pressable && !isFriendRequest && !isDuelRequest;

  return (
    <article className={item.isRead ? 'settings-notif-card' : 'settings-notif-card is-unread'}>
      {interactive ? (
        <button type="button" className="settings-notif-hit" onClick={onPress}>
          <NotificationCardBody item={item} />
        </button>
      ) : (
        <div className="settings-notif-hit is-static">
          <NotificationCardBody item={item} />
        </div>
      )}

      {isFriendRequest && onAcceptFriend && onRejectFriend ? (
        <div className="settings-notif-actions">
          <button type="button" className="settings-notif-accept" disabled={busy} onClick={onAcceptFriend}>
            {busy ? '…' : 'Accepter'}
          </button>
          <button type="button" className="settings-notif-reject" disabled={busy} onClick={onRejectFriend}>
            Refuser
          </button>
        </div>
      ) : null}

      {isDuelRequest && onAcceptDuel && onRejectDuel ? (
        <div className="settings-notif-actions">
          <button type="button" className="settings-notif-accept" disabled={busy} onClick={onAcceptDuel}>
            {busy ? '…' : 'Accepter'}
          </button>
          <button type="button" className="settings-notif-reject" disabled={busy} onClick={onRejectDuel}>
            Refuser
          </button>
        </div>
      ) : null}

      <div className="settings-notif-tools">
        {!item.isRead && onMarkRead ? (
          <button type="button" className="settings-notif-read" disabled={busy} onClick={onMarkRead}>
            Marquer lu
          </button>
        ) : null}
        {onDeleteRequest ? (
          <button
            type="button"
            className="settings-notif-delete"
            aria-label="Supprimer"
            onClick={onDeleteRequest}
          >
            <Icon name="trash-2" size={16} color="#C62828" />
          </button>
        ) : null}
      </div>
    </article>
  );
}

function NotificationCardBody({ item }: { item: AppNotification }) {
  const visual = getNotificationVisual(item.type);
  return (
    <>
      <span className="settings-notif-icon" style={{ background: visual.iconBackground }}>
        <Icon name={visual.icon} size={20} color={visual.iconColor} />
      </span>
      <div className="settings-notif-body">
        <div className="settings-notif-title-row">
          <strong className={item.isRead ? undefined : 'is-unread'}>{item.title}</strong>
          {!item.isRead ? <span className="settings-notif-dot" style={{ background: visual.accent }} /> : null}
        </div>
        {item.body ? <p>{item.body}</p> : null}
        <time>{formatNotificationTime(item.createdAt)}</time>
      </div>
    </>
  );
}
