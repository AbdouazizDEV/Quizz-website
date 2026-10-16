import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import type { PlanId } from '@app-types/premium.types';
import { PremiumPageShell } from '@components/ui/premium/PremiumPageShell';
import { Routes } from '@constants/Routes';
import { apiClient } from '@services/api/apiClient';

import { PREMIUM_PLANS } from './premiumPlans';

export function PremiumPaymentPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const plan = (params.get('plan') ?? 'plan_1m') as PlanId;
  const selected = PREMIUM_PLANS.find((item) => item.id === plan) ?? PREMIUM_PLANS[0];
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <PremiumPageShell title="Paiement" onBack={() => navigate(Routes.PREMIUM_PLANS)}>
      <section className="premium-summary gains-fade">
        <p>{selected.label}</p>
        <strong>{selected.price}</strong>
        <em>{selected.hint}</em>
      </section>

      <p className="premium-lead">
        Wave, Orange Money ou Mixx : le choix se fait sur la page Payfonte. Aucun argent réel en sandbox.
      </p>
      {error ? <p className="premium-lead">{error}</p> : null}

      <button
        type="button"
        className="premium-cta"
        disabled={pending}
        onClick={() => {
          setPending(true);
          setError(null);
          void apiClient
            .post<{ url: string }>('/payments/checkout', { plan_id: selected.id })
            .then((response) => {
              window.location.assign(response.data.url);
            })
            .catch((reason: unknown) => {
              const message = readError(reason);
              setError(message);
              setPending(false);
            });
        }}
      >
        {pending ? 'Ouverture de Payfonte…' : `Payer ${selected.price}`}
      </button>
    </PremiumPageShell>
  );
}

function readError(reason: unknown): string {
  if (reason && typeof reason === 'object' && 'response' in reason) {
    const data = (reason as { response?: { data?: { message?: unknown; error?: unknown } } }).response?.data;
    if (typeof data?.message === 'string') return data.message;
    if (typeof data?.error === 'string') return data.error;
  }
  return 'Le paiement n’a pas pu démarrer.';
}
