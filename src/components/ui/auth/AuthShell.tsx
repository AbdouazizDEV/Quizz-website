import type { ReactNode } from 'react';
import clsx from 'clsx';

interface AuthShellProps {
  children: ReactNode;
  footer?: ReactNode;
  artSrc?: string;
  headline?: string;
  subline?: string;
  variant?: 'walkthrough' | 'login' | 'onboarding';
}

export function AuthShell({
  children,
  footer,
  artSrc = '/assets/icons/image1.png',
  headline = 'Joue. Progresse. Gagne.',
  subline = 'Quiz, défis et récompenses — le même Quizz+ que sur mobile.',
  variant = 'onboarding',
}: AuthShellProps) {
  return (
    <div className={clsx('auth-root', 'auth-shell', `auth-shell--${variant}`)}>
      <aside className="auth-brand" aria-hidden>
        <div className="auth-brand-glow" />
        <div className="auth-brand-inner">
          <div className="auth-brand-mark">
            <img src="/assets/icons/logo.png" alt="" />
            <span>Quizz+</span>
          </div>
          <img src={artSrc} alt="" className="auth-brand-art" />
          <h2 className="auth-brand-headline">{headline}</h2>
          <p className="auth-brand-sub">{subline}</p>
        </div>
      </aside>
      <div className="auth-stage">
        <div className="auth-stage-card">
          <div
            className={clsx(
              'auth-main',
              variant === 'walkthrough' ? 'auth-main--walkthrough' : 'auth-main--onboarding',
            )}
          >
            <div className="auth-column">{children}</div>
          </div>
          {footer}
        </div>
      </div>
    </div>
  );
}
