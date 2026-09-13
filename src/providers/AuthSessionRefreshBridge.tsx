import { useEffect, useRef } from 'react';

import {
  PROACTIVE_REFRESH_INTERVAL_MS,
  refreshAuthSessionIfNeeded,
} from '@services/auth/refreshAuthSession';
import { getAuthMeFromStore } from '@services/auth/authMeRepository';
import { registerExpoPushDevice } from '@services/notifications/registerExpoPushDevice';
import { syncStreakReminders } from '@services/notifications/streakReminderSync';
import { runOfflineSync } from '@services/offline/offlineSyncEngine';
import { useAuthStore } from '@stores/authStore';

export function AuthSessionRefreshBridge() {
  const pushRegistered = useRef(false);

  useEffect(() => {
    const runStreakCheck = () => {
      if (!useAuthStore.getState().token?.trim()) return;
      const streak = getAuthMeFromStore()?.profile?.streak_days ?? 0;
      void syncStreakReminders(streak);
    };

    const ensurePush = () => {
      if (!useAuthStore.getState().token?.trim() || pushRegistered.current) return;
      void registerExpoPushDevice().then((res) => {
        if (res.ok) pushRegistered.current = true;
      });
    };

    const refreshSession = () => {
      if (!useAuthStore.getState().token?.trim()) return;
      void refreshAuthSessionIfNeeded({ force: false }).then((result) => {
        if (result.ok) void runOfflineSync();
      });
    };

    const refreshIfVisible = () => {
      if (document.visibilityState !== 'visible') return;
      refreshSession();
      runStreakCheck();
      ensurePush();
    };

    runStreakCheck();
    ensurePush();
    refreshSession();

    const streakInterval = setInterval(runStreakCheck, 60_000);
    const refreshInterval = setInterval(refreshSession, PROACTIVE_REFRESH_INTERVAL_MS);
    document.addEventListener('visibilitychange', refreshIfVisible);

    return () => {
      clearInterval(streakInterval);
      clearInterval(refreshInterval);
      document.removeEventListener('visibilitychange', refreshIfVisible);
    };
  }, []);

  return null;
}
