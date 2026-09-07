import { BrowserRouter } from 'react-router-dom';
import { AppQueryProvider } from '@providers/AppQueryProvider';
import { AppErrorProvider } from '@providers/AppErrorProvider';
import { OfflineProvider } from '@providers/OfflineProvider';
import { AuthHydrationGate } from './AuthHydrationGate';
import { AppRoutes } from './router';
import { AuthSessionRefreshBridge } from '@providers/AuthSessionRefreshBridge';
import { OfflineSyncBridge } from '@providers/OfflineSyncBridge';
import { ToastHost } from '@components/ui/common/ToastHost';
import { DocumentSeo } from '@components/seo/DocumentSeo';

export function App() {
  return (
    <AppQueryProvider>
      <AppErrorProvider>
        <OfflineProvider>
          <BrowserRouter>
            <DocumentSeo />
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
