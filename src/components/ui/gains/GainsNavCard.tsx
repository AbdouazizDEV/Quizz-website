import { Link } from 'react-router-dom';

import { Icon } from '@components/ui/Icon';

interface GainsNavCardProps {
  icon: string;
  title: string;
  subtitle: string;
  to: string;
  accent: string;
  delayMs: number;
}

export function GainsNavCard({ icon, title, subtitle, to, accent, delayMs }: GainsNavCardProps) {
  return (
    <Link
      to={to}
      className="gains-nav-card gains-fade"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <span className="gains-nav-icon" style={{ background: `${accent}33` }}>
        <Icon name={icon} size={18} color="#1F2347" />
      </span>
      <span className="gains-nav-copy">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </span>
      <Icon name="chevron-right" size={18} color="#BDBDBD" className="gains-nav-chevron" />
    </Link>
  );
}
