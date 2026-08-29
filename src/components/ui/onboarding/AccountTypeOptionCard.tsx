import clsx from 'clsx';
import { Icon } from '@components/ui/Icon';

export interface AccountTypeOption {
  id: string;
  label: string;
  gradientStart: string;
  icon: string;
}

interface AccountTypeOptionCardProps {
  option: AccountTypeOption;
  selected?: boolean;
  onPress?: (id: string) => void;
}

export function AccountTypeOptionCard({ option, selected, onPress }: AccountTypeOptionCardProps) {
  return (
    <button
      type="button"
      className={clsx('account-card', selected && 'is-selected')}
      onClick={() => onPress?.(option.id)}
    >
      <span className="account-card-icon" style={{ background: option.gradientStart }}>
        <span className="account-card-icon-circle">
          <Icon name={option.icon} size={24} color="#FFFFFF" />
        </span>
      </span>
      <span className="account-card-content">
        <span className="account-card-label">{option.label}</span>
      </span>
    </button>
  );
}
