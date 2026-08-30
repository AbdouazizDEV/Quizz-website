import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { SettingsMenuEntry } from '@app-types/settingsMenu.types';
import { LogoutConfirmModal } from '@components/ui/settings/LogoutConfirmModal';
import { PremiumPromoCard } from '@components/ui/settings/PremiumPromoCard';
import { SettingsLeadingHeader } from '@components/ui/settings/SettingsLeadingHeader';
import { SettingsMenuRow } from '@components/ui/settings/SettingsMenuRow';
import { Routes } from '@constants/Routes';
import { signOutAndSyncStore } from '@services/auth/authSessionController';
import { getSettingsMenuEntries } from '@services/settings/settingsMenuRegistry';
import { useSettingsStore } from '@stores/settingsStore';

interface SettingsPanelContentProps {
  title?: string;
  onBack: () => void;
  onAfterLogout?: () => void;
  isVisitor?: boolean;
  fullWidth?: boolean;
  dismissBeforeNavigate?: boolean;
}

export function SettingsPanelContent({
  title = 'Paramètres',
  onBack,
  onAfterLogout,
  isVisitor = false,
  fullWidth = false,
  dismissBeforeNavigate = false,
}: SettingsPanelContentProps) {
  const navigate = useNavigate();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const darkMode = useSettingsStore((s) => s.darkMode);
  const setDarkMode = useSettingsStore((s) => s.setDarkMode);
  const menuEntries = useMemo(() => getSettingsMenuEntries(), []);

  const go = useCallback(
    (href: string) => {
      if (dismissBeforeNavigate) onBack();
      navigate(href);
    },
    [dismissBeforeNavigate, navigate, onBack],
  );

  const confirmLogout = useCallback(async () => {
    setLogoutOpen(false);
    await signOutAndSyncStore();
    onAfterLogout?.();
    navigate(Routes.LOGIN, { replace: true });
  }, [navigate, onAfterLogout]);

  const renderRow = (entry: SettingsMenuEntry) => {
    if (entry.kind === 'toggle') {
      return (
        <SettingsMenuRow
          key={entry.id}
          variant="toggle"
          label={entry.label}
          icon={entry.icon}
          iconBackground={entry.iconBackground}
          iconColor={entry.iconColor}
          value={darkMode}
          onValueChange={setDarkMode}
        />
      );
    }

    if (entry.kind === 'logout') {
      if (isVisitor) {
        return (
          <SettingsMenuRow
            key={entry.id}
            variant="nav"
            label="Se connecter"
            icon="log-in"
            iconBackground="#E8F5E9"
            iconColor="#2E7D32"
            onPress={() => {
              onBack();
              navigate(Routes.LOGIN);
            }}
          />
        );
      }
      return (
        <SettingsMenuRow
          key={entry.id}
          variant="nav"
          label={entry.label}
          icon={entry.icon}
          iconBackground={entry.iconBackground}
          iconColor={entry.iconColor}
          danger
          showChevron={false}
          onPress={() => setLogoutOpen(true)}
        />
      );
    }

    return (
      <SettingsMenuRow
        key={entry.id}
        variant="nav"
        label={entry.label}
        icon={entry.icon}
        iconBackground={entry.iconBackground}
        iconColor={entry.iconColor}
        onPress={() => go(entry.href)}
      />
    );
  };

  return (
    <div className={fullWidth ? 'settings-panel is-full' : 'settings-panel'}>
      <SettingsLeadingHeader title={title} onBack={onBack} />
      <div className={fullWidth ? 'settings-panel-body settings-hub-board' : 'settings-panel-body'}>
        <div className="settings-hub-promo">
          <PremiumPromoCard onBeforeNavigate={dismissBeforeNavigate ? onBack : undefined} />
        </div>
        <div className="settings-menu">{menuEntries.map(renderRow)}</div>
      </div>
      <LogoutConfirmModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={() => void confirmLogout()}
      />
    </div>
  );
}
