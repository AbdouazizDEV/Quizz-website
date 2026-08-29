import { Icon } from '@components/ui/Icon';

interface ProfileQuizzListHeaderProps {
  title: string;
  sortLabel: string;
  onPressSort?: () => void;
}

export function ProfileQuizzListHeader({ title, sortLabel, onPressSort }: ProfileQuizzListHeaderProps) {
  return (
    <div className="cat-list-header">
      <p className="cat-list-count">{title}</p>
      <button type="button" className="cat-sort" aria-label="Trier les quiz" onClick={onPressSort}>
        {sortLabel}
        <span className="cat-sort-arrows">
          <Icon name="chevron-up" size={12} color="#C9A000" />
          <Icon name="chevron-down" size={12} color="#C9A000" />
        </span>
      </button>
    </div>
  );
}
