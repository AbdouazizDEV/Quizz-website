import { SettingsPanelContent } from '@components/ui/settings/SettingsPanelContent';

interface HomeSettingsDrawerProps {
  visible: boolean;
  onClose: () => void;
  isVisitor?: boolean;
}

export function HomeSettingsDrawer({ visible, onClose, isVisitor = false }: HomeSettingsDrawerProps) {
  if (!visible) return null;

  return (
    <div className="home-overlay is-drawer" role="dialog" aria-modal="true" aria-label="Paramètres">
      <button type="button" className="home-backdrop" aria-label="Fermer" onClick={onClose} />
      <aside className="home-drawer">
        <SettingsPanelContent
          title="Paramètres"
          onBack={onClose}
          isVisitor={isVisitor}
          fullWidth
          dismissBeforeNavigate
        />
      </aside>
    </div>
  );
}
