import { useNavigate } from 'react-router-dom';

import { Icon } from '@components/ui/Icon';
import { PremiumPageShell } from '@components/ui/premium/PremiumPageShell';
import { Routes } from '@constants/Routes';

const BENEFITS = [
  { icon: 'award', title: 'Carnet d’erreurs', body: 'Revois tes ratés, l’explication, et refais seulement ceux-là. Sans points.' },
  { icon: 'zap', title: 'Entraînement', body: 'Replays sans plafond, une session Express en plus, un gel de série.' },
  { icon: 'trending-up', title: 'Identité', body: 'Badge Or du Sahel, cadres, thèmes et avatars d’Afrique de l’Ouest.' },
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
          <h2>Entraîne-toi mieux. Le classement reste le même.</h2>
          <p>Le Premium donne des outils pour comprendre tes erreurs. Il n’ajoute aucun point.</p>
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
