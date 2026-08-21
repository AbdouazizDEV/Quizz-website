import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { invalidateAuthMeCache } from '@services/auth/authMeRepository';
import { onOfflineSyncComplete } from '@services/offline';

export function OfflineSyncBridge() {
  const queryClient = useQueryClient();

  useEffect(() => {
    return onOfflineSyncComplete(() => {
      void queryClient.invalidateQueries();
      void invalidateAuthMeCache();
    });
  }, [queryClient]);

  return null;
}
