import type { DefisSummaryLine } from '@app-types/defisDashboard.types';
import { Icon } from '@components/ui/Icon';

interface DefisSummaryCardProps {
  items: DefisSummaryLine[];
  onPress: (id: DefisSummaryLine['id']) => void;
}

export function DefisSummaryCard({ items, onPress }: DefisSummaryCardProps) {
  return (
    <section className="defis-summary defis-fade">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`defis-summary-row${item.count > 0 ? ' is-live' : ''}`}
          onClick={() => onPress(item.id)}
        >
          <span className="defis-summary-icon">
            <Icon name={item.icon} size={18} color="#1A1A2E" />
          </span>
          <span className="defis-summary-copy">
            <span className="defis-summary-label">{item.label}</span>
            {item.count > 0 ? <span className="defis-summary-count">{item.count}</span> : null}
          </span>
          <Icon name="chevron-right" size={18} color="#C4C4CC" />
        </button>
      ))}
    </section>
  );
}
