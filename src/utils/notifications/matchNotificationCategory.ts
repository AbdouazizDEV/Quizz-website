import type { AppNotification, NotificationCategory } from '@app-types/notification.types';

export function matchNotificationCategory(item: AppNotification, category: NotificationCategory): boolean {
  const type = item.type;
  if (category === 'all') return true;
  if (category === 'friends') return type.includes('friend');
  if (category === 'duels') return type.includes('duel');
  return !type.includes('friend') && !type.includes('duel');
}
