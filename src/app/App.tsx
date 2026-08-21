import { BrowserRouter } from 'react-router-dom';
import { AppQueryProvider } from '@providers/AppQueryProvider';
import { AppErrorProvider } from '@providers/AppErrorProvider';
import { OfflineProvider } from '@providers/OfflineProvider';
import { AuthHydrationGate } from './AuthHydrationGate';
import { AppRoutes } from './router';
import { AuthSessionRefreshBridge } from '@providers/AuthSessionRefreshBridge';
import { OfflineSyncBridge } from '@providers/OfflineSyncBridge';
import { ToastHost } from '@components/ui/common/ToastHost';

export function App() {
  return (
    <AppQueryProvider>
      <AppErrorProvider>
        <OfflineProvider>
          <BrowserRouter>
            <AuthHydrationGate>
              <AuthSessionRefreshBridge />
              <OfflineSyncBridge />
              <ToastHost />
              <AppRoutes />
            </AuthHydrationGate>
          </BrowserRouter>
        </OfflineProvider>
      </AppErrorProvider>
    </AppQueryProvider>
  );
}
