import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandLocalStorage } from '@platform/webStorage';
import type { PlanId } from '../types/premium.types';

interface PremiumState {
  isPremium: boolean;
  plan: PlanId | null;
  expiresAt: Date | null;
  setActive: (planId: PlanId, expiresAt: Date) => void;
  reset: () => void;
}

export const usePremiumStore = create<PremiumState>()(
  persist(
    (set) => ({
      isPremium: false,
      plan: null,
      expiresAt: null,
      setActive: (plan, expiresAt) => set({ isPremium: true, plan, expiresAt }),
      reset: () => set({ isPremium: false, plan: null, expiresAt: null }),
    }),
    {
      name: 'premium-storage',
      storage: createJSONStorage(() => zustandLocalStorage),
    },
  ),
);
