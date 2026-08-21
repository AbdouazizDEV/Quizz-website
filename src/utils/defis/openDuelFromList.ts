import type { NavigateFunction } from 'react-router-dom';
import type { QueryClient } from '@tanstack/react-query';

import type { DuelSummary } from '@app-types/challenge.types';
import { DefisRoutes } from '@constants/defisRoutes';
import {
  prefetchDuelQuery,
  seedDuelQueryCache,
  shouldOpenDuelResult,
} from '@hooks/defis/useDuelQuery';

export function openDuelFromList(
  navigate: NavigateFunction,
  queryClient: QueryClient,
  duel: DuelSummary,
) {
  if (shouldOpenDuelResult(duel)) {
    seedDuelQueryCache(queryClient, duel);
    void prefetchDuelQuery(queryClient, duel.id);
    navigate(DefisRoutes.duelResult(duel.id));
    return;
  }
  seedDuelQueryCache(queryClient, duel);
  navigate(DefisRoutes.duelDetail(duel.id));
}
