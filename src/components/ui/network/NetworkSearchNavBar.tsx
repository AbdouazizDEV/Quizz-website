import { Icon } from '@components/ui/Icon';

interface NetworkSearchNavBarProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  autoFocus?: boolean;
}

export function NetworkSearchNavBar({
  value,
  onChange,
  onClose,
  autoFocus = true,
}: NetworkSearchNavBarProps) {
  return (
    <div className="network-search-nav">
      <button
        type="button"
        className="network-search-side"
        aria-label="Fermer la recherche"
        onClick={onClose}
      >
        <Icon name="chevron-left" size={26} color="#212121" />
      </button>
      <input
        className="network-search-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Rechercher par @username"
        autoCapitalize="none"
        autoCorrect="off"
        autoFocus={autoFocus}
        type="search"
        enterKeyHint="search"
      />
      {value.length > 0 ? (
        <button
          type="button"
          className="network-search-side"
          aria-label="Effacer"
          onClick={() => onChange('')}
        >
          <Icon name="x" size={22} color="#212121" />
        </button>
      ) : (
        <span className="network-search-side" aria-hidden />
      )}
    </div>
  );
}
