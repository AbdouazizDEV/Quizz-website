import { Icon } from '@components/ui/Icon';

interface HomeTopNavbarProps {
  onPressNotifications?: () => void;
  onPressMenu?: () => void;
  notificationCount?: number;
}

export function HomeTopNavbar({
  onPressNotifications,
  onPressMenu,
  notificationCount = 0,
}: HomeTopNavbarProps) {
  const hasNotifications = notificationCount > 0;

  return (
    <header className="home-top-nav">
      <div className="home-top-nav-side">
        <button type="button" className="home-icon-btn home-menu-btn" aria-label="Menu" onClick={onPressMenu}>
          <Icon name="menu" size={24} color="#212121" />
        </button>
      </div>
      <div className="home-top-nav-center">
        <img src="/assets/icons/logo.png" alt="" />
        <span className="home-top-nav-title">Quizz+</span>
      </div>
      <div className="home-top-nav-side is-right">
        <button
          type="button"
          className="home-icon-btn"
          aria-label={hasNotifications ? `Notifications (${notificationCount})` : 'Notifications'}
          onClick={onPressNotifications}
        >
          <Icon name="bell" size={24} color="#212121" />
          {hasNotifications ? (
            <span className="home-bell-badge">{notificationCount > 99 ? '99+' : notificationCount}</span>
          ) : null}
        </button>
      </div>
    </header>
  );
}
