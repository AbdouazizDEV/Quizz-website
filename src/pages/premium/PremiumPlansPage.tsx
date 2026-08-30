import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { PlanId } from '@app-types/premium.types';
import { PremiumPageShell } from '@components/ui/premium/PremiumPageShell';
import { Routes } from '@constants/Routes';

import { PREMIUM_PLANS } from './premiumPlans';

export function PremiumPlansPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<PlanId>('plan_3m');

  return (
    <PremiumPageShell title="Plans" onBack={() => navigate(Routes.PREMIUM)}>
      <p className="premium-lead">Choisis la durée qui te convient. Tu pourras changer plus tard.</p>
      <div className="premium-plan-list">
        {PREMIUM_PLANS.map((plan) => (
          <button
            key={plan.id}
            type="button"
            className={selected === plan.id ? 'premium-plan-card is-selected' : 'premium-plan-card'}
            onClick={() => setSelected(plan.id)}
          >
            <strong>{plan.label}</strong>
            <span>{plan.price}</span>
            <em>{plan.hint}</em>
          </button>
        ))}
      </div>
      <button
        type="button"
        className="premium-cta"
        onClick={() => navigate(`${Routes.PREMIUM_PAYMENT}?plan=${selected}`)}
      >
        Continuer
      </button>
    </PremiumPageShell>
  );
}
