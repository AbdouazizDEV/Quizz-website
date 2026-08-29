import type { ProfileTabId } from '@app-types/profile.types';

const TABS: Array<{ id: ProfileTabId; label: string }> = [
  { id: 'quizzo', label: 'Mes quiz' },
  { id: 'collections', label: 'Trophées' },
  { id: 'about', label: 'À propos' },
];

interface ProfileSegmentedTabsProps {
  active: ProfileTabId;
  onChange: (id: ProfileTabId) => void;
}

export function ProfileSegmentedTabs({ active, onChange }: ProfileSegmentedTabsProps) {
  return (
    <div className="profile-tabs" role="tablist">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          className={active === tab.id ? 'profile-tab is-on' : 'profile-tab'}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
