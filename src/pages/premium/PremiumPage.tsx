import { Link, useNavigate } from 'react-router-dom';
import { Routes } from '@constants/Routes';
import { usePremiumStore } from '@stores/premiumStore';
import type { PlanId } from '@app-types/premium.types';

const PLANS: { id: PlanId; label: string; price: string }[] = [
  { id: 'plan_1m', label: '1 mois', price: '1 500 FCFA' },
  { id: 'plan_3m', label: '3 mois', price: '3 900 FCFA' },
  { id: 'plan_12m', label: '12 mois', price: '12 000 FCFA' },
];

export function PremiumPage() {
  return (
    <div className="page-hero">
      <h1>Quizz+ Premium</h1>
      <p>Sans pubs, défis exclusifs, et un boost de visibilité au classement.</p>
      <Link to={Routes.PREMIUM_PLANS} className="btn btn-ghost" style={{ marginTop: 16 }}>Voir les plans</Link>
    </div>
  );
}

export function PremiumComparePage() {
  return (
    <div>
      <h1>Comparer</h1>
      <p>Gratuit : quiz et défis de base. Premium : plus de replays, stats avancées, badge.</p>
      <Link to={Routes.PREMIUM_PLANS} className="btn btn-primary">Choisir un plan</Link>
    </div>
  );
}

export function PremiumPlansPage() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Plans</h1>
      {PLANS.map((p) => (
        <button key={p.id} type="button" className="card" style={{ padding: 16, width: '100%', marginBottom: 10, textAlign: 'left', background: '#fff' }} onClick={() => navigate(`${Routes.PREMIUM_PAYMENT}?plan=${p.id}`)}>
          <strong>{p.label}</strong>
          <div>{p.price}</div>
        </button>
      ))}
    </div>
  );
}

export function PremiumPaymentPage() {
  const navigate = useNavigate();
  const setActive = usePremiumStore((s) => s.setActive);
  const plan = (new URLSearchParams(window.location.search).get('plan') ?? 'plan_1m') as PlanId;
  return (
    <div>
      <h1>Paiement</h1>
      <p>Simulation de paiement (Wave, Orange Money, carte).</p>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          const expires = new Date();
          expires.setMonth(expires.getMonth() + 1);
          setActive(plan, expires);
          navigate(Routes.PREMIUM_SUCCESS);
        }}
      >
        Payer
      </button>
    </div>
  );
}

export function PremiumSuccessPage() {
  return (
    <div className="page-hero">
      <h1>Bienvenue en Premium</h1>
      <Link to={Routes.HOME} className="btn btn-ghost">Retour à l’accueil</Link>
    </div>
  );
}
