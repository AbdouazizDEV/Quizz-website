import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Routes } from '@constants/Routes';
import { useAuthStore } from '@stores/authStore';

export function SplashPage() {
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const hasRegisteredAccount = useAuthStore((s) => s.hasRegisteredAccount);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (token?.trim()) navigate(Routes.HOME, { replace: true });
      else if (hasRegisteredAccount) navigate(Routes.LOGIN, { replace: true });
      else navigate(Routes.WALKTHROUGH, { replace: true });
    }, 900);
    return () => window.clearTimeout(timer);
  }, [hasRegisteredAccount, navigate, token]);

  return (
    <div
      style={{
        minHeight: '100svh',
        display: 'grid',
        placeItems: 'center',
        background: 'linear-gradient(160deg, #E8431A, #F5A623, #FFD166)',
        color: '#fff',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <img src="/assets/icons/logo.png" alt="Quizz+" width={96} height={96} style={{ margin: '0 auto 16px' }} />
        <h1 style={{ margin: 0, fontSize: 36, fontWeight: 900 }}>Quizz+</h1>
        <p style={{ marginTop: 8, fontWeight: 700 }}>Joue, progresse et défie tes amis.</p>
      </div>
    </div>
  );
}
