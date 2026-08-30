import { Icon } from '@components/ui/Icon';
import type { HelpContactEntry } from '@constants/helpCenterContent';

interface HelpContactRowProps {
  entry: HelpContactEntry;
}

export function HelpContactRow({ entry }: HelpContactRowProps) {
  return (
    <a className="settings-contact" href={entry.target} target="_blank" rel="noreferrer">
      <span className="settings-row-icon is-lg" style={{ background: entry.iconBackground }}>
        <Icon name={entry.icon} size={20} color={entry.iconColor} />
      </span>
      <span>
        <strong>{entry.label}</strong>
        <em>{entry.subtitle}</em>
      </span>
      <Icon name="external-link" size={18} color="#BDBDBD" />
    </a>
  );
}
