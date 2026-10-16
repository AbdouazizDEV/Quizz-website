import { useNavigate } from 'react-router-dom';

import { Icon } from '@components/ui/Icon';
import { PremiumPageShell } from '@components/ui/premium/PremiumPageShell';
import { Routes } from '@constants/Routes';

const ROWS = [
  { label: 'Quiz, défis et Arena', free: true, premium: true },
  { label: 'Classement au même barème', free: true, premium: true },
  { label: 'Badges gagnés en jouant', free: true, premium: true },
  { label: '3 parties classées par jour', free: true, premium: false },
  { label: 'Replays classés sans plafond', free: false, premium: true },
  { label: 'Carnet d’erreurs et révision', free: false, premium: true },
  { label: 'Stats 30 jours par catégorie', free: false, premium: true },
  { label: 'Gel de série et objectif hebdo', free: false, premium: true },
  { label: 'Badge, cadres et thèmes Premium', free: false, premium: true },
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
