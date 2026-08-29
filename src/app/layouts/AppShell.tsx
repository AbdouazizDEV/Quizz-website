import { Outlet } from 'react-router-dom';
import { OfflineBanner } from '@components/ui/common/OfflineBanner';
import { HomeBottomNav, HomeSidebarNav } from '@components/ui/home/HomeBottomNav';

export function AppShell() {
  return (
    <div className="app-shell">
      <HomeSidebarNav />
      <div className="app-main">
        <OfflineBanner />
        <div className="app-content">
          <Outlet />
        </div>
        <HomeBottomNav />
      </div>
    </div>
  );
}
