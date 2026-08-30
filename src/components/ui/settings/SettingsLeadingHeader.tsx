import { Icon } from '@components/ui/Icon';

interface SettingsLeadingHeaderProps {
  title: string;
  onBack: () => void;
}

export function SettingsLeadingHeader({ title, onBack }: SettingsLeadingHeaderProps) {
  return (
    <header className="settings-leading">
      <button type="button" className="settings-leading-back" aria-label="Retour" onClick={onBack}>
        <Icon name="chevron-left" size={26} />
      </button>
      <h1 className="settings-leading-title">{title}</h1>
    </header>
  );
}
