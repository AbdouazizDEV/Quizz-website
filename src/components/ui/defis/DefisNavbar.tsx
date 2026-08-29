import { Icon } from '@components/ui/Icon';

interface DefisNavbarProps {
  title: string;
  onBack?: () => void;
}

export function DefisNavbar({ title, onBack }: DefisNavbarProps) {
  if (!onBack) {
    return (
      <header className="defis-navbar is-hub">
        <h1 className="defis-navbar-title">{title}</h1>
      </header>
    );
  }

  return (
    <header className="defis-navbar">
      <button type="button" className="defis-navbar-side" aria-label="Retour" onClick={onBack}>
        <Icon name="chevron-left" size={26} color="#1A1A2E" />
      </button>
      <h1 className="defis-navbar-title">{title}</h1>
      <span className="defis-navbar-side" />
    </header>
  );
}
