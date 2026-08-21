import { NavLink, Outlet } from 'react-router-dom';
import { Routes } from '@constants/Routes';
import { OfflineBanner } from '@components/ui/common/OfflineBanner';
import { Icon } from '@components/ui/Icon';

const NAV = [
  { to: Routes.HOME, label: 'Accueil', icon: 'house' },
  { to: Routes.CATEGORIES, label: 'Jouer', icon: 'gamepad-2' },
  { to: Routes.DEFIS, label: 'Défis', icon: 'zap' },
  { to: Routes.GAINS, label: 'Gains', icon: 'gift' },
  { to: Routes.PROFILE, label: 'Profil', icon: 'user' },
] as const;

export function AppShell() {
  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="sidebar-brand">
          <img src="/assets/icons/logo.png" alt="" />
          <div>
            <strong>Quizz+</strong>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Joue. Progresse. Gagne.</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              <Icon name={item.icon} size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="app-main">
        <OfflineBanner />
        <div className="app-content">
          <Outlet />
        </div>
        <nav className="bottom-nav" aria-label="Navigation principale">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              <Icon name={item.icon} size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
