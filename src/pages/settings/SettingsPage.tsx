import { useNavigate } from 'react-router-dom';

import { SettingsPanelContent } from '@components/ui/settings/SettingsPanelContent';
import { Routes } from '@constants/Routes';

export function SettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="settings-page settings-hub-page">
      <SettingsPanelContent
        title="Paramètres"
        fullWidth
        onBack={() => {
          if (window.history.length > 1) navigate(-1);
          else navigate(Routes.PROFILE, { replace: true });
        }}
      />
    </div>
  );
}
