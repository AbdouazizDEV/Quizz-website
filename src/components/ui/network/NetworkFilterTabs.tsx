import type { ConnectionFilter } from '@app-types/network.types';

const TABS: { id: ConnectionFilter; label: string }[] = [
  { id: 'friends', label: 'Amis' },
  { id: 'suggestions', label: "Suggestions d'amis" },
];

interface NetworkFilterTabsProps {
  active: ConnectionFilter;
  onChange: (id: ConnectionFilter) => void;
}

export function NetworkFilterTabs({ active, onChange }: NetworkFilterTabsProps) {
  return (
    <div className="network-tabs" role="tablist" aria-label="Filtres réseau">
      {TABS.map((tab) => {
        const isOn = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isOn}
            className={isOn ? 'network-tab is-on' : 'network-tab'}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
