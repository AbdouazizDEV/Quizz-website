import type { NotificationCategory } from '@app-types/notification.types';

const CHIPS: Array<{ id: NotificationCategory; label: string }> = [
  { id: 'all', label: 'Tout' },
  { id: 'friends', label: 'Amis' },
  { id: 'duels', label: 'Duels' },
  { id: 'announcements', label: 'Annonces' },
];

interface NotificationFilterChipsProps {
  category: NotificationCategory;
  onChange: (category: NotificationCategory) => void;
}

export function NotificationFilterChips({ category, onChange }: NotificationFilterChipsProps) {
  return (
    <div className="settings-filter-chips" role="tablist" aria-label="Filtrer les notifications">
      {CHIPS.map((chip) => (
        <button
          key={chip.id}
          type="button"
          role="tab"
          aria-selected={category === chip.id}
          className={category === chip.id ? 'settings-filter-chip is-on' : 'settings-filter-chip'}
          onClick={() => onChange(chip.id)}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}
