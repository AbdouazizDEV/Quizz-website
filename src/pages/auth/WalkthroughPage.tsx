import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Routes } from '@constants/Routes';

const SLIDES = [
  {
    title: 'Joue à des quiz fun',
    body: 'Des milliers de questions, un chrono, des sons et des points selon la difficulté.',
    image: '/assets/icons/image1.png',
  },
  {
    title: 'Défie tes amis',
    body: 'Duels, challenges hebdo et tournois pour grimper au classement.',
    image: '/assets/icons/image2.png',
  },
  {
    title: 'Gagne des récompenses',
    body: 'Streak, cash prizes et bons d’achat pour les meilleurs joueurs.',
    image: '/assets/icons/image3.png',
  },
];

export function WalkthroughPage() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];

  return (
    <div className="auth-page">
      <div className="auth-inner" style={{ display: 'flex', flexDirection: 'column', minHeight: '100svh' }}>
        <img src={slide.image} alt="" style={{ width: '100%', maxHeight: 280, objectFit: 'contain', marginTop: 24 }} />
        <h1 style={{ fontSize: 32, margin: '24px 0 8px' }}>{slide.title}</h1>
        <p className="muted">{slide.body}</p>
        <div style={{ display: 'flex', gap: 8, margin: '24px 0' }}>
          {SLIDES.map((_, i) => (
            <span
              key={i}
              style={{
                width: i === index ? 22 : 8,
                height: 8,
                borderRadius: 99,
                background: i === index ? '#E8431A' : '#E5E5EA',
              }}
            />
          ))}
        </div>
        <div style={{ marginTop: 'auto', display: 'grid', gap: 12, paddingBottom: 24 }}>
          {index < SLIDES.length - 1 ? (
            <button type="button" className="btn btn-primary" onClick={() => setIndex((i) => i + 1)}>
              Continuer
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={() => navigate(Routes.CREATE_ACCOUNT_TYPE)}>
              Créer un compte
            </button>
          )}
          <Link to={Routes.LOGIN} className="btn btn-ghost" style={{ textAlign: 'center' }}>
            J’ai déjà un compte
          </Link>
        </div>
      </div>
    </div>
  );
}
