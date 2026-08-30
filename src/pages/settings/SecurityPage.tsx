import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';

import { Icon } from '@components/ui/Icon';
import { SettingsLeadingHeader } from '@components/ui/settings/SettingsLeadingHeader';
import { SettingsSectionCard } from '@components/ui/settings/SettingsSectionCard';
import { Routes } from '@constants/Routes';

export function SecurityPage() {
  const navigate = useNavigate();

  return (
    <div className="settings-page is-sub">
      <SettingsLeadingHeader
        title="Sécurité"
        onBack={() => {
          if (window.history.length > 1) navigate(-1);
          else navigate(Routes.SETTINGS, { replace: true });
        }}
      />

      <div className="settings-sub-board settings-security-board">
        <SettingsSectionCard title="Connexion">
          <div className="settings-security-intro">
            <span
              className="settings-row-icon is-lg"
              style={{ '--icon-bg': '#E8F5E9', '--icon-fg': '#2E7D32' } as CSSProperties}
            >
              <Icon name="key-round" size={20} />
            </span>
            <p className="settings-copy">
              Quizz+ s’appuie sur une connexion par e-mail ou pseudo, et prépare l’authentification
              sans mot de passe via <strong>passkeys (WebAuthn)</strong>. Vos identifiants restent
              sur l’appareil : empreinte, visage ou clé de sécurité.
            </p>
          </div>
        </SettingsSectionCard>

        <SettingsSectionCard title="Passkeys">
          <p className="settings-copy">
            La gestion des passkeys (ajout, suppression, appareils de confiance) arrivera dans une
            prochaine version. En attendant, utilisez « Mot de passe oublié » sur l’écran de
            connexion si besoin.
          </p>
          <button type="button" className="settings-soon-btn" disabled>
            Gérer les passkeys — bientôt
          </button>
        </SettingsSectionCard>
      </div>
    </div>
  );
}
