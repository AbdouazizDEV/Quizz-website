import { useNavigate } from 'react-router-dom';

import { EtoileMark } from '@components/ui/settings/EtoileMark';
import { Routes } from '@constants/Routes';

interface PremiumPromoCardProps {
  onBeforeNavigate?: () => void;
}

export function PremiumPromoCard({ onBeforeNavigate }: PremiumPromoCardProps) {
  const navigate = useNavigate();

  return (
    <article className="settings-premium">
      <div className="settings-premium-body">
        <div className="settings-premium-stars" aria-hidden>
          <span className="settings-premium-star is-1">
            <EtoileMark size={28} />
          </span>
          <span className="settings-premium-star is-2">
            <EtoileMark size={40} />
          </span>
          <span className="settings-premium-star is-3">
            <EtoileMark size={22} />
          </span>
        </div>
        <p className="settings-premium-title">Jouez sans publicité ni restriction.</p>
        <button
          type="button"
          className="settings-premium-cta"
          onClick={() => {
            onBeforeNavigate?.();
            navigate(Routes.PREMIUM_PLANS);
          }}
        >
          PASSER EN PREMIUM
        </button>
      </div>
      <span className="settings-premium-bar" />
    </article>
  );
}
