import { Icon } from '@components/ui/Icon';

interface StatisticsNavbarProps {
  title: string;
  onBack: () => void;
  onSearch?: () => void;
  onMore?: () => void;
}

export function StatisticsNavbar({ title, onBack, onSearch, onMore }: StatisticsNavbarProps) {
  return (
    <header className="cat-navbar">
      <button type="button" className="cat-navbar-side" aria-label="Retour" onClick={onBack}>
        <Icon name="chevron-left" size={26} color="#212121" />
      </button>
      <h1 className="cat-navbar-title">{title}</h1>
      {onMore ? (
        <button type="button" className="cat-navbar-side" aria-label="Plus d’options" onClick={onMore}>
          <Icon name="more-horizontal" size={24} color="#212121" />
        </button>
      ) : onSearch ? (
        <button type="button" className="cat-navbar-side" aria-label="Rechercher" onClick={onSearch}>
          <Icon name="search" size={24} color="#212121" />
        </button>
      ) : (
        <span className="cat-navbar-side" />
      )}
    </header>
  );
}
