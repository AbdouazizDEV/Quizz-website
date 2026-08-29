import { NavLink, useLocation } from 'react-router-dom';
import { HOME_NAV_ITEMS, resolveActiveNavId } from '@constants/homeNav';
import { Routes } from '@constants/Routes';
import { Icon } from '@components/ui/Icon';

interface HomeBottomNavProps {
  height?: number;
}

export function HomeBottomNav({ height = 86 }: HomeBottomNavProps) {
  const { pathname } = useLocation();
  const activeId = resolveActiveNavId(pathname);

  return (
    <nav className="home-bottom-nav" aria-label="Navigation principale" style={{ minHeight: height }}>
      <div className="home-bottom-nav-row">
        {HOME_NAV_ITEMS.map((item) => {
          const active = item.id === activeId;
          return (
            <NavLink
              key={item.id}
              to={item.to}
              replace={item.id !== 'play'}
              className="home-bottom-item"
              aria-current={active ? 'page' : undefined}
              data-active={active ? 'true' : 'false'}
            >
              <Icon name={item.icon} size={21} color={active ? '#1A1A2E' : '#8D8F9A'} />
              <span className={active ? 'home-bottom-label is-active' : 'home-bottom-label'}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export function HomeSidebarNav() {
  const { pathname } = useLocation();
  const activeId = resolveActiveNavId(pathname);
  const settingsActive = pathname.startsWith('/settings');

  return (
    <aside className="home-sidebar">
      <NavLink to={Routes.HOME} className="home-sidebar-brand" aria-label="Quizz+ — Accueil">
        <span className="home-sidebar-logo">
          <img src="/assets/icons/logo.png" alt="" />
        </span>
        <span className="home-sidebar-brand-text">
          <strong>Quizz+</strong>
          <em>Joue. Monte. Gagne.</em>
        </span>
      </NavLink>
      <nav className="home-sidebar-nav" aria-label="Navigation principale">
        {HOME_NAV_ITEMS.map((item) => {
          const active = item.id === activeId;
          return (
            <NavLink
              key={item.id}
              to={item.to}
              replace={item.id !== 'play'}
              className="home-sidebar-item"
              data-active={active ? 'true' : 'false'}
              title={item.label}
            >
              <span className="home-sidebar-icon">
                <Icon name={item.icon} size={20} color={active ? '#1A1A2E' : '#FFB703'} />
              </span>
              <span className="home-sidebar-label">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
      <div className="home-sidebar-foot">
        <NavLink
          to={Routes.SETTINGS}
          className="home-sidebar-item is-ghost"
          data-active={settingsActive ? 'true' : 'false'}
          title="Paramètres"
        >
          <span className="home-sidebar-icon">
            <Icon name="settings" size={20} color={settingsActive ? '#1A1A2E' : 'rgba(255,255,255,0.78)'} />
          </span>
          <span className="home-sidebar-label">Paramètres</span>
        </NavLink>
      </div>
    </aside>
  );
}
