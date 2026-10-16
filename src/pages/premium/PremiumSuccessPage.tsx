import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Icon } from '@components/ui/Icon';
import { PremiumPageShell } from '@components/ui/premium/PremiumPageShell';
import { Routes } from '@constants/Routes';
import { apiClient } from '@services/api/apiClient';
import { invalidateAuthMeCache } from '@services/auth/authMeRepository';

type PaymentView = { status: string };

export function PremiumSuccessPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const reference = params.get('reference');
  const [status, setStatus] = useState(reference ? 'pending' : 'missing');

  useEffect(() => {
    if (!reference) return undefined;
    let stopped = false;
    let attempts = 0;

    const poll = async () => {
      attempts += 1;
      try {
        const response = await apiClient.get<PaymentView>(`/payments/${reference}`);
        if (stopped) return;
        setStatus(response.data.status);
        if (response.data.status === 'success') {
          await invalidateAuthMeCache();
          return;
        }
        if (response.data.status === 'failed' || attempts >= 8) return;
      } catch {
        if (attempts >= 8) {
          setStatus('failed');
          return;
        }
      }
      if (!stopped && attempts < 8) {
        window.setTimeout(() => void poll(), 2000);
      }
    };

    void poll();
    return () => {
      stopped = true;
    };
  }, [reference]);

  const title = status === 'success' ? 'Bienvenue en Premium' : status === 'failed' || status === 'missing' ? 'Paiement non confirmé' : 'Vérification du paiement';
  const text = status === 'success'
    ? 'Le paiement est confirmé. Le carnet, les badges et les outils d’entraînement sont actifs.'
    : status === 'pending'
      ? 'Payfonte confirme encore le paiement. Cette page se met à jour toute seule.'
      : 'Le retour sur cette page n’active pas le premium. Réessayez depuis les tarifs si le paiement n’a pas abouti.';

  return (
    <PremiumPageShell title="Premium" onBack={() => navigate(Routes.PROFILE, { replace: true })}>
      <section className="premium-success gains-fade">
        <span className="premium-success-mark">
          <Icon name={status === 'success' ? 'check' : 'info'} size={36} color="#1F2261" />
        </span>
        <h2>{title}</h2>
        <p>{text}</p>
      </section>
      <button type="button" className="premium-cta" onClick={() => navigate(status === 'success' ? Routes.CARNET : Routes.PREMIUM_PLANS, { replace: true })}>
        {status === 'success' ? 'Ouvrir le carnet' : 'Retour aux tarifs'}
      </button>
    </PremiumPageShell>
  );
}
