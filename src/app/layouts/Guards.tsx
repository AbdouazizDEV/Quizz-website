import { Navigate, Outlet } from 'react-router-dom';
import { Routes } from '@constants/Routes';
import { useAuthStore } from '@stores/authStore';

export function ProtectedRoute() {
  const token = useAuthStore((s) => s.token);
  const hydrated = useAuthStore((s) => s.hydrated);
  if (!hydrated) return <SplashFallback />;
  if (!token?.trim()) return <Navigate to={Routes.LOGIN} replace />;
  return <Outlet />;
}

export function GuestRoute() {
  const token = useAuthStore((s) => s.token);
  const hydrated = useAuthStore((s) => s.hydrated);
  if (!hydrated) return <SplashFallback />;
  if (token?.trim()) return <Navigate to={Routes.HOME} replace />;
  return <Outlet />;
}

function SplashFallback() {
  return (
    <div style={{ minHeight: '100svh', display: 'grid', placeItems: 'center', background: '#fff' }}>
      <img src="/assets/icons/logo.png" alt="Quizz+" width={72} height={72} />
    </div>
  );
}
