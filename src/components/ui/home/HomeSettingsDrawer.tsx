import { useNavigate } from 'react-router-dom';
import { Routes } from '@constants/Routes';
import { getSettingsMenuEntries } from '@services/settings/settingsMenuRegistry';
import { signOutAndSyncStore } from '@services/auth/authSessionController';
import { useSettingsStore } from '@stores/settingsStore';
import { Icon } from '@components/ui/Icon';

interface HomeSettingsDrawerProps {
  visible: boolean;
  onClose: () => void;
  isVisitor?: boolean;
}

export function HomeSettingsDrawer({ visible, onClose, isVisitor = false }: HomeSettingsDrawerProps) {
  const navigate = useNavigate();
  const darkMode = useSettingsStore((s) => s.darkMode);
  const setDarkMode = useSettingsStore((s) => s.setDarkMode);

  if (!visible) return null;

  return (
    <div className="home-overlay is-drawer" role="dialog" aria-modal="true" aria-label="Paramètres">
      <button type="button" className="home-backdrop" aria-label="Fermer" onClick={onClose} />
      <aside className="home-drawer">
        <button type="button" className="home-icon-btn" aria-label="Fermer" onClick={onClose}>
          <Icon name="arrow-left" size={22} color="#212121" />
        </button>
        <h2 className="home-drawer-title">Paramètres</h2>
        {getSettingsMenuEntries().map((entry) => {
          if (entry.kind === 'toggle') {
            return (
              <button
                key={entry.id}
                type="button"
                className="home-settings-item"
                onClick={() => setDarkMode(!darkMode)}
              >
                <span className="home-settings-icon" style={{ background: entry.iconBackground }}>
                  <Icon name={entry.icon} size={18} color={entry.iconColor} />
                </span>
                <span style={{ flex: 1 }}>{entry.label}</span>
                <strong>{darkMode ? 'On' : 'Off'}</strong>
              </button>
            );
          }
          if (entry.kind === 'logout') {
            return (
              <button
                key={entry.id}
                type="button"
                className="home-settings-item"
                onClick={async () => {
                  onClose();
                  if (isVisitor) {
                    navigate(Routes.LOGIN);
                    return;
                  }
                  await signOutAndSyncStore();
                  navigate(Routes.LOGIN, { replace: true });
                }}
              >
                <span className="home-settings-icon" style={{ background: entry.iconBackground }}>
                  <Icon name={entry.icon} size={18} color={entry.iconColor} />
                </span>
                {isVisitor ? 'Se connecter' : entry.label}
              </button>
            );
          }
          return (
            <button
              key={entry.id}
              type="button"
              className="home-settings-item"
              onClick={() => {
                onClose();
                navigate(entry.href);
              }}
            >
              <span className="home-settings-icon" style={{ background: entry.iconBackground }}>
                <Icon name={entry.icon} size={18} color={entry.iconColor} />
              </span>
              {entry.label}
            </button>
          );
        })}
      </aside>
    </div>
  );
}
