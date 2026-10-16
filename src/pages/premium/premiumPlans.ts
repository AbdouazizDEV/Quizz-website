import type { PlanId } from '@app-types/premium.types';

export const PREMIUM_PLANS: { id: PlanId; label: string; price: string; hint: string }[] = [
  { id: 'plan_1m', label: '1 mois', price: '1 500 FCFA', hint: 'Les mêmes outils, un mois' },
  { id: 'plan_12m', label: '12 mois', price: '15 000 FCFA', hint: 'Deux mois offerts et 3 gels de série' },
];
