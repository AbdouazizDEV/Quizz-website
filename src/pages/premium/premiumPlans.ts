import type { PlanId } from '@app-types/premium.types';

export const PREMIUM_PLANS: { id: PlanId; label: string; price: string; hint: string }[] = [
  { id: 'plan_1m', label: '1 mois', price: '1 500 FCFA', hint: 'Essai flexible' },
  { id: 'plan_3m', label: '3 mois', price: '3 900 FCFA', hint: 'Le plus populaire' },
  { id: 'plan_12m', label: '12 mois', price: '12 000 FCFA', hint: 'Meilleur tarif' },
];
