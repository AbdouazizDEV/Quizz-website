export function isNetworkOnline(state: { isConnected: boolean | null; isInternetReachable?: boolean | null }): boolean {
  if (state.isConnected !== true) return false;
  if (state.isInternetReachable === false) return false;
  return true;
}

export async function fetchNetworkOnline(): Promise<boolean> {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

export function subscribeNetworkOnline(onChange: (online: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  const handleOnline = () => onChange(true);
  const handleOffline = () => onChange(false);
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  onChange(navigator.onLine);
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}
