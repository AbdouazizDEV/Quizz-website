import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { AppNotification, NotificationCategory } from '@app-types/notification.types';
import { Icon } from '@components/ui/Icon';
import { NotificationDeleteConfirmModal } from '@components/ui/settings/NotificationDeleteConfirmModal';
import { NotificationFilterChips } from '@components/ui/settings/NotificationFilterChips';
import { NotificationListItem } from '@components/ui/settings/NotificationListItem';
import { NotificationMessageModal } from '@components/ui/settings/NotificationMessageModal';
import { SettingsLeadingHeader } from '@components/ui/settings/SettingsLeadingHeader';
import { DefisRoutes } from '@constants/defisRoutes';
import { Routes } from '@constants/Routes';
import { useNotificationInteractions } from '@hooks/useNotificationInteractions';
import { useNotifications } from '@hooks/useNotifications';
import { useAppError } from '@providers/AppErrorProvider';
import { matchNotificationCategory } from '@utils/notifications/matchNotificationCategory';

export function NotificationsPage() {
  const navigate = useNavigate();
  const { showAppError } = useAppError();
  const [category, setCategory] = useState<NotificationCategory>('all');
  const {
    items,
    unreadCount,
    loading,
    loadingMore,
    error,
    hasMore,
    actionId,
    refresh,
    loadMore,
    markRead,
    markAllRead,
    remove,
    acceptFriend,
    rejectFriend,
    acceptDuel,
    rejectDuel,
  } = useNotifications();

  const {
    messageItem,
    deleteTarget,
    deleteBusy,
    handlePress,
    requestDelete,
    cancelDelete,
    confirmDelete,
    closeMessage,
  } = useNotificationInteractions({ markRead, remove });

  const visibleItems = useMemo(
    () => items.filter((item) => matchNotificationCategory(item, category)),
    [category, items],
  );

  const onAcceptDuel = useCallback(
    async (item: AppNotification) => {
      try {
        const duelId = await acceptDuel(item);
        navigate(DefisRoutes.duelDetail(duelId));
      } catch (err) {
        showAppError(err instanceof Error ? err.message : "Impossible d'accepter le duel.", {
          title: 'Duel',
        });
      }
    },
    [acceptDuel, navigate, showAppError],
  );

  const onRejectDuel = useCallback(
    async (item: AppNotification) => {
      try {
        await rejectDuel(item);
      } catch (err) {
        showAppError(err instanceof Error ? err.message : 'Impossible de refuser le duel.', {
          title: 'Duel',
        });
      }
    },
    [rejectDuel, showAppError],
  );

  return (
    <div className="settings-page is-sub">
      <SettingsLeadingHeader
        title="Notifications"
        onBack={() => {
          if (window.history.length > 1) navigate(-1);
          else navigate(Routes.SETTINGS, { replace: true });
        }}
      />

      <div className="settings-notif-toolbar">
        <NotificationFilterChips category={category} onChange={setCategory} />
        <div className="settings-notif-toolbar-actions">
          {unreadCount > 0 ? (
            <button type="button" className="settings-mark-all" onClick={() => void markAllRead()}>
              <Icon name="check-circle" size={18} color="#1F2261" />
              Tout lire
            </button>
          ) : null}
          <button type="button" className="settings-mark-all" onClick={() => void refresh()}>
            <Icon name="rotate-ccw" size={16} color="#1F2261" />
            Actualiser
          </button>
        </div>
      </div>

      {loading && items.length === 0 ? (
        <div className="settings-loader" role="status" aria-label="Chargement">
          <div className="settings-spinner-gold" />
        </div>
      ) : null}

      {error && items.length === 0 ? <p className="settings-error">{error.message}</p> : null}

      {!loading && visibleItems.length === 0 ? (
        <div className="settings-notif-empty">
          <span className="settings-notif-empty-icon">
            <Icon name="bell-off" size={32} color="#9E9E9E" />
          </span>
          <strong>Aucune notification</strong>
          <p>Les défis, demandes d'amis et annonces apparaîtront ici.</p>
        </div>
      ) : (
        <div className="settings-notif-list settings-notif-grid">
          {visibleItems.map((item) => (
            <NotificationListItem
              key={item.id}
              item={item}
              busy={actionId === item.id}
              onPress={() => void handlePress(item)}
              onMarkRead={!item.isRead ? () => void markRead(item.id) : undefined}
              onAcceptFriend={
                item.type === 'friend_request' && !item.isRead
                  ? () => void acceptFriend(item.id)
                  : undefined
              }
              onRejectFriend={
                item.type === 'friend_request' && !item.isRead
                  ? () => void rejectFriend(item.id)
                  : undefined
              }
              onAcceptDuel={
                item.type === 'duel_request' && !item.isRead ? () => void onAcceptDuel(item) : undefined
              }
              onRejectDuel={
                item.type === 'duel_request' && !item.isRead ? () => void onRejectDuel(item) : undefined
              }
              onDeleteRequest={() => requestDelete(item)}
            />
          ))}
        </div>
      )}

      {hasMore ? (
        <button
          type="button"
          className="settings-text-btn"
          disabled={loadingMore}
          onClick={() => void loadMore()}
        >
          {loadingMore ? 'Chargement…' : 'Charger plus'}
        </button>
      ) : null}

      {!hasMore && visibleItems.length > 0 ? <p className="settings-end-hint">Fin de la liste</p> : null}

      <NotificationMessageModal item={messageItem} onClose={closeMessage} />
      <NotificationDeleteConfirmModal
        item={deleteTarget}
        busy={deleteBusy || actionId === deleteTarget?.id}
        onCancel={cancelDelete}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
