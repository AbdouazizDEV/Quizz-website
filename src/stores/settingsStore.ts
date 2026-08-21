import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandLocalStorage } from '@platform/webStorage';

interface SettingsState {
  musicEnabled: boolean;
  setMusicEnabled: (value: boolean) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      musicEnabled: true,
      setMusicEnabled: (musicEnabled) => set({ musicEnabled }),
      darkMode: false,
      setDarkMode: (darkMode) => set({ darkMode }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => zustandLocalStorage),
    },
  ),
);
