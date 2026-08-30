import type { CSSProperties } from 'react';

import { Icon } from '@components/ui/Icon';

interface SettingsMenuRowBase {
  label: string;
  icon: string;
  iconBackground: string;
  iconColor: string;
}

interface SettingsMenuRowNavProps extends SettingsMenuRowBase {
  variant: 'nav';
  onPress: () => void;
  danger?: boolean;
  showChevron?: boolean;
}

interface SettingsMenuRowToggleProps extends SettingsMenuRowBase {
  variant: 'toggle';
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export type SettingsMenuRowProps = SettingsMenuRowNavProps | SettingsMenuRowToggleProps;

function IconBubble({
  icon,
  iconBackground,
  iconColor,
}: Pick<SettingsMenuRowBase, 'icon' | 'iconBackground' | 'iconColor'>) {
  return (
    <span
      className="settings-row-icon"
      style={{ '--icon-bg': iconBackground, '--icon-fg': iconColor } as CSSProperties}
    >
      <Icon name={icon} size={20} />
    </span>
  );
}

export function SettingsMenuRow(props: SettingsMenuRowProps) {
  const bubble = (
    <IconBubble icon={props.icon} iconBackground={props.iconBackground} iconColor={props.iconColor} />
  );

  if (props.variant === 'toggle') {
    return (
      <div className="settings-row">
        {bubble}
        <span className="settings-row-label">{props.label}</span>
        <button
          type="button"
          className={props.value ? 'settings-switch is-on' : 'settings-switch'}
          role="switch"
          aria-checked={props.value}
          aria-label={props.label}
          onClick={() => props.onValueChange(!props.value)}
        >
          <span className="settings-switch-knob" />
        </button>
      </div>
    );
  }

  const showChevron = props.showChevron !== false;

  return (
    <button
      type="button"
      className={props.danger ? 'settings-row is-pressable is-danger' : 'settings-row is-pressable'}
      onClick={props.onPress}
    >
      {bubble}
      <span className="settings-row-label">{props.label}</span>
      {showChevron ? <Icon name="chevron-right" size={20} color="#BDBDBD" /> : <span className="settings-row-spacer" />}
    </button>
  );
}
