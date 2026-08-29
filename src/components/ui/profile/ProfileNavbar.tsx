import { useNavigate } from 'react-router-dom';

import { Icon } from '@components/ui/Icon';
import { Routes } from '@constants/Routes';

export function ProfileNavbar() {
  const navigate = useNavigate();

  return (
    <header className="profile-navbar">
      <div className="profile-navbar-brand">
        <img src="/assets/icons/logo.png" alt="" />
        <h1>Profil</h1>
      </div>
      <div className="profile-navbar-actions">
        <button
          type="button"
          className="profile-icon-btn"
          aria-label="Réseau"
          onClick={() => navigate(Routes.NETWORK)}
        >
          <Icon name="users" size={22} color="#212121" />
        </button>
        <button
          type="button"
          className="profile-icon-btn"
          aria-label="Statistiques"
          onClick={() => navigate(Routes.STATISTICS)}
        >
          <Icon name="bar-chart-2" size={22} color="#212121" />
        </button>
        <button
          type="button"
          className="profile-icon-btn"
          aria-label="Réglages"
          onClick={() => navigate(Routes.SETTINGS)}
        >
          <Icon name="settings" size={22} color="#212121" />
        </button>
      </div>
    </header>
  );
}
