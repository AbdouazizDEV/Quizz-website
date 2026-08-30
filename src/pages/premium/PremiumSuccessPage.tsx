import { useNavigate } from 'react-router-dom';

import { Icon } from '@components/ui/Icon';
import { PremiumPageShell } from '@components/ui/premium/PremiumPageShell';
import { Routes } from '@constants/Routes';

export function PremiumSuccessPage() {
  const navigate = useNavigate();

  return (
    <PremiumPageShell title="Premium" onBack={() => navigate(Routes.PROFILE, { replace: true })}>
      <section className="premium-success gains-fade">
        <span className="premium-success-mark">
          <Icon name="check" size={36} color="#1F2261" />
        </span>
        <h2>Bienvenue en Premium</h2>
        <p>Vos avantages sont actifs. Profitez des quiz sans publicité.</p>
      </section>
      <button type="button" className="premium-cta" onClick={() => navigate(Routes.PROFILE, { replace: true })}>
        Retour au profil
      </button>
    </PremiumPageShell>
  );
}
