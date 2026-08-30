import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import type { PaymentMethodId, PlanId } from '@app-types/premium.types';
import { PremiumPageShell } from '@components/ui/premium/PremiumPageShell';
import { Routes } from '@constants/Routes';
import { usePremiumStore } from '@stores/premiumStore';

import { PREMIUM_PLANS } from './premiumPlans';

const METHODS: { id: PaymentMethodId; label: string }[] = [
  { id: 'wave', label: 'Wave' },
  { id: 'orange_money', label: 'Orange Money' },
  { id: 'paypal', label: 'PayPal' },
];

export function PremiumPaymentPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const setActive = usePremiumStore((s) => s.setActive);
  const plan = (params.get('plan') ?? 'plan_1m') as PlanId;
  const selected = PREMIUM_PLANS.find((item) => item.id === plan) ?? PREMIUM_PLANS[0];
  const [method, setMethod] = useState<PaymentMethodId>('wave');

  return (
    <PremiumPageShell title="Paiement" onBack={() => navigate(Routes.PREMIUM_PLANS)}>
      <section className="premium-summary gains-fade">
        <p>{selected.label}</p>
        <strong>{selected.price}</strong>
        <em>{selected.hint}</em>
      </section>

      <p className="premium-lead">Moyen de paiement (simulation)</p>
      <div className="premium-methods">
        {METHODS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={method === item.id ? 'premium-method is-selected' : 'premium-method'}
            onClick={() => setMethod(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="premium-cta"
        onClick={() => {
          const expires = new Date();
          expires.setMonth(expires.getMonth() + (plan === 'plan_12m' ? 12 : plan === 'plan_3m' ? 3 : 1));
          setActive(plan, expires);
          navigate(Routes.PREMIUM_SUCCESS);
        }}
      >
        Confirmer {selected.price}
      </button>
    </PremiumPageShell>
  );
}
