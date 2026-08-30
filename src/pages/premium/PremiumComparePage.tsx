import { useNavigate } from 'react-router-dom';

import { Icon } from '@components/ui/Icon';
import { PremiumPageShell } from '@components/ui/premium/PremiumPageShell';
import { Routes } from '@constants/Routes';

const ROWS = [
  { label: 'Quiz et catégories', free: true, premium: true },
  { label: 'Défis de base', free: true, premium: true },
  { label: 'Classement public', free: true, premium: true },
  { label: 'Sans publicité', free: false, premium: true },
  { label: 'Replays illimités', free: false, premium: true },
  { label: 'Stats avancées', free: false, premium: true },
  { label: 'Badge Premium', free: false, premium: true },
] as const;

export function PremiumComparePage() {
  const navigate = useNavigate();

  return (
    <PremiumPageShell title="Comparer" onBack={() => navigate(Routes.PREMIUM)}>
      <section className="premium-compare gains-fade">
        <div className="premium-compare-head">
          <span />
          <strong>Gratuit</strong>
          <strong>Premium</strong>
        </div>
        {ROWS.map((row) => (
          <div key={row.label} className="premium-compare-row">
            <span>{row.label}</span>
            <span>{row.free ? <Icon name="check" size={18} color="#2E7D32" /> : '—'}</span>
            <span>{row.premium ? <Icon name="check" size={18} color="#543ACC" /> : '—'}</span>
          </div>
        ))}
      </section>
      <button type="button" className="premium-cta" onClick={() => navigate(Routes.PREMIUM_PLANS)}>
        Choisir un plan
      </button>
    </PremiumPageShell>
  );
}
