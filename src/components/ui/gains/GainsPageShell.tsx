import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { GainsRoutes } from '@constants/gainsRoutes';
import { Icon } from '@components/ui/Icon';

interface GainsPageShellProps {
  title: string;
  showBack?: boolean;
  children: ReactNode;
}

export function GainsPageShell({ title, showBack = false, children }: GainsPageShellProps) {
  const navigate = useNavigate();

  const onBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate(GainsRoutes.hub);
  };

  return (
    <div className={showBack ? 'gains-page gains-subpage' : 'gains-page gains-hub'}>
      {showBack ? (
        <header className="gains-navbar">
          <button type="button" className="profile-icon-btn" aria-label="Retour" onClick={onBack}>
            <Icon name="chevron-left" size={26} color="#212121" />
          </button>
          <h1 className="gains-navbar-title">{title}</h1>
          <span className="profile-icon-btn" />
        </header>
      ) : (
        <div className="gains-hub-title-wrap">
          <h1 className="gains-hub-title">{title}</h1>
        </div>
      )}
      {children}
    </div>
  );
}
