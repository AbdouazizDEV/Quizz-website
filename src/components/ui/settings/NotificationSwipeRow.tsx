import type { ReactNode } from 'react';

import { Icon } from '@components/ui/Icon';
import { useSwipeToDelete } from '@hooks/useSwipeToDelete';

interface NotificationSwipeRowProps {
  enabled?: boolean;
  onSwipeDelete: () => void;
  children: ReactNode;
  className?: string;
}

export function NotificationSwipeRow({
  enabled = true,
  onSwipeDelete,
  children,
  className,
}: NotificationSwipeRowProps) {
  const { translateX, isDragging, handlers } = useSwipeToDelete(onSwipeDelete, enabled);

  if (!enabled) {
    return <div className={className}>{children}</div>;
  }

  const revealSide = translateX > 0 ? 'left' : translateX < 0 ? 'right' : null;

  return (
    <div className={`settings-notif-swipe ${className ?? ''}`.trim()}>
      <div
        className={`settings-notif-swipe-bg is-left${revealSide === 'left' ? ' is-visible' : ''}`}
        aria-hidden
      >
        <Icon name="trash-2" size={18} color="#FFFFFF" />
        <span>Supprimer</span>
      </div>
      <div
        className={`settings-notif-swipe-bg is-right${revealSide === 'right' ? ' is-visible' : ''}`}
        aria-hidden
      >
        <Icon name="trash-2" size={18} color="#FFFFFF" />
        <span>Supprimer</span>
      </div>
      <div
        className={`settings-notif-swipe-content${isDragging ? ' is-dragging' : ''}`}
        style={{ transform: `translateX(${translateX}px)` }}
        {...handlers}
      >
        {children}
      </div>
    </div>
  );
}
