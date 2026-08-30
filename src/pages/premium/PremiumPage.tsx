import { useNavigate } from 'react-router-dom';

import { Icon } from '@components/ui/Icon';
import { PremiumPageShell } from '@components/ui/premium/PremiumPageShell';
import { Routes } from '@constants/Routes';

const BENEFITS = [
  { icon: 'zap', title: 'Sans publicité', body: 'Enchaîne les quiz sans interruption.' },
  { icon: 'award', title: 'Avantages exclusifs', body: 'Plus de replays et un badge Premium.' },
  { icon: 'trending-up', title: 'Boost classement', body: 'Gagne en visibilité sur le scoreboard.' },
] as const;

export function PremiumPage() {
  const navigate = useNavigate();

  return (
    <PremiumPageShell
      title="Quizz+ Premium"
      onBack={() => {
        if (window.history.length > 1) navigate(-1);
        else navigate(Routes.PROFILE, { replace: true });
      }}
    >
      <div className="premium-board">
        <section className="premium-hero gains-fade">
          <h2>Jouez sans publicité ni restriction.</h2>
          <p>Défis exclusifs, plus de replays et un boost de visibilité au classement.</p>
          <button type="button" className="premium-cta" onClick={() => navigate(Routes.PREMIUM_PLANS)}>
            Voir les plans
          </button>
          <button
            type="button"
            className="premium-link"
            onClick={() => navigate(Routes.PREMIUM_COMPARE)}
          >
            Comparer Gratuit / Premium
          </button>
        </section>

        <ul className="premium-benefit-list">
          {BENEFITS.map((item) => (
            <li key={item.title} className="premium-benefit">
              <span className="premium-benefit-icon">
                <Icon name={item.icon} size={20} color="#FFB703" />
              </span>
              <div>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </PremiumPageShell>
  );
}
