import { useNetworkStatus } from '@hooks/useNetworkStatus';

export function OfflineBanner() {
  const { isOnline, pendingSyncCount } = useNetworkStatus();
  if (isOnline && pendingSyncCount === 0) return null;

  return (
    <div className="offline-banner" role="status">
      {!isOnline
        ? 'Hors ligne — tes scores seront synchronisés au retour du réseau.'
        : `${pendingSyncCount} action${pendingSyncCount > 1 ? 's' : ''} en attente de sync.`}
    </div>
  );
}
