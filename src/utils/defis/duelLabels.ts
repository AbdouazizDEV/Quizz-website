import type { DuelPhase } from '@app-types/challenge.types';

export function duelPhaseLabel(phase: DuelPhase): string {
  switch (phase) {
    case 'needs_your_acceptance':
      return 'À accepter';
    case 'waiting_opponent_acceptance':
      return 'En attente d’acceptation';
    case 'your_turn':
      return 'À toi de jouer';
    case 'waiting_opponent_play':
      return 'En attente de l’adversaire';
    case 'expired':
      return 'Expiré';
    case 'finished':
      return 'Terminé';
    default:
      return 'Duel';
  }
}
