import type { AppNotification } from '@app-types/notification.types';
import { formatNotificationTime, getNotificationVisual } from '@services/notifications/notificationPresentation';
import { isPendingDuelRequest } from '@services/notifications/duelNotificationHelpers';
import { Icon } from '@components/ui/Icon';

interface HomeNotificationsSheetProps {
  visible: boolean;
  loading: boolean;
  items: AppNotification[];
  unreadCount: number;
  actionId: string | null;
  onClose: () => void;
  onMarkAllRead: () => void;
  onPressItem: (item: AppNotification) => void;
  onDeleteRequest: (item: AppNotification) => void;
  onAcceptFriend: (id: string) => void;
  onRejectFriend: (id: string) => void;
  onAcceptDuel: (item: AppNotification) => void;
  onRejectDuel: (item: AppNotification) => void;
  onSeeAll: () => void;
}

export function HomeNotificationsSheet({
  visible,
  loading,
  items,
  unreadCount,
  actionId,
  onClose,
  onMarkAllRead,
  onPressItem,
  onDeleteRequest,
  onAcceptFriend,
  onRejectFriend,
  onAcceptDuel,
  onRejectDuel,
  onSeeAll,
}: HomeNotificationsSheetProps) {
  if (!visible) return null;

  return (
    <div className="home-overlay is-sheet" role="dialog" aria-modal="true" aria-label="Notifications">
      <button type="button" className="home-backdrop" aria-label="Fermer" onClick={onClose} />
      <div className="home-sheet">
        <div className="home-grabber" />
        <div className="home-sheet-head">
          <h2 className="home-sheet-title">Notifications</h2>
          {unreadCount > 0 ? (
            <span className="home-unread-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
          ) : null}
        </div>
        <div className="home-sheet-toolbar">
          {unreadCount > 0 ? (
            <button type="button" className="home-sheet-link is-mark" onClick={onMarkAllRead}>
              <Icon name="circle-check" size={16} color="#1F2261" />
              Tout lire
            </button>
          ) : (
            <span />
          )}
          <button type="button" className="home-sheet-link is-all" onClick={onSeeAll}>
            Voir tout
            <Icon name="chevron-right" size={16} color="#C9A000" />
          </button>
        </div>
        <div className="home-sheet-body">
          {loading && items.length === 0 ? (
            <p className="home-loading">Chargement…</p>
          ) : items.length === 0 ? (
            <div className="home-loading">
              <Icon name="bell-off" size={28} color="#9E9E9E" />
              <p className="home-section-title" style={{ fontSize: 16, marginTop: 8 }}>
                Aucune notification
              </p>
              <p className="home-empty-note">
                Les défis, demandes d'amis et annonces apparaîtront ici.
              </p>
            </div>
          ) : (
            items.map((item) => {
              const visual = getNotificationVisual(item.type);
              const isFriend = item.type === 'friend_request' && !item.isRead;
              const isDuel = isPendingDuelRequest(item);
              return (
                <article key={item.id} className="home-notif-card">
                  <span
                    className="home-settings-icon"
                    style={{ background: visual.iconBackground }}
                  >
                    <Icon name={visual.icon} size={20} color={visual.iconColor} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <button
                      type="button"
                      onClick={() => onPressItem(item)}
                      style={{
                        background: 'transparent',
                        border: 0,
                        padding: 0,
                        textAlign: 'left',
                        width: '100%',
                        cursor: 'pointer',
                      }}
                    >
                      <strong style={{ color: '#212121' }}>{item.title}</strong>
                      {item.body ? (
                        <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: 13 }}>{item.body}</p>
                      ) : null}
                      <p style={{ margin: '4px 0 0', color: '#9ca3af', fontSize: 12 }}>
                        {formatNotificationTime(item.createdAt)}
                      </p>
                    </button>
                    {isFriend ? (
                      <div className="home-notif-actions">
                        <button
                          type="button"
                          className="home-notif-accept"
                          disabled={actionId === item.id}
                          onClick={() => onAcceptFriend(item.id)}
                        >
                          Accepter
                        </button>
                        <button
                          type="button"
                          className="home-notif-reject"
                          disabled={actionId === item.id}
                          onClick={() => onRejectFriend(item.id)}
                        >
                          Refuser
                        </button>
                      </div>
                    ) : null}
                    {isDuel ? (
                      <div className="home-notif-actions">
                        <button
                          type="button"
                          className="home-notif-accept"
                          disabled={actionId === item.id}
                          onClick={() => onAcceptDuel(item)}
                        >
                          Accepter
                        </button>
                        <button
                          type="button"
                          className="home-notif-reject"
                          disabled={actionId === item.id}
                          onClick={() => onRejectDuel(item)}
                        >
                          Refuser
                        </button>
                      </div>
                    ) : null}
                    <button
                      type="button"
                      className="home-sheet-link"
                      style={{ color: '#E53935', marginTop: 6 }}
                      onClick={() => onDeleteRequest(item)}
                    >
                      <Icon name="trash-2" size={14} color="#E53935" />
                      Supprimer
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
