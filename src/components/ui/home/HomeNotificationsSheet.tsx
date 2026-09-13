import type { AppNotification } from '@app-types/notification.types';
import { NotificationListItem } from '@components/ui/settings/NotificationListItem';
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
  onSwipeDelete: (item: AppNotification) => void;
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
  onSwipeDelete,
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
        <div className="home-sheet-body home-notif-list">
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
            items.map((item) => (
              <NotificationListItem
                key={item.id}
                item={item}
                compact
                busy={actionId === item.id}
                onPress={() => onPressItem(item)}
                onAcceptFriend={
                  item.type === 'friend_request' && !item.isRead
                    ? () => onAcceptFriend(item.id)
                    : undefined
                }
                onRejectFriend={
                  item.type === 'friend_request' && !item.isRead
                    ? () => onRejectFriend(item.id)
                    : undefined
                }
                onAcceptDuel={
                  item.type === 'duel_request' && !item.isRead ? () => onAcceptDuel(item) : undefined
                }
                onRejectDuel={
                  item.type === 'duel_request' && !item.isRead ? () => onRejectDuel(item) : undefined
                }
                onSwipeDelete={() => onSwipeDelete(item)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
