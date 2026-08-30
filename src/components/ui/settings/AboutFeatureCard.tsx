import type { CSSProperties } from 'react';

import { Icon } from '@components/ui/Icon';

const ICON_STYLE = {
  layers: { bg: '#FFF3E0', color: '#F57C00' },
  zap: { bg: '#FFF8E1', color: '#FFB703' },
  users: { bg: '#E8F5E9', color: '#43A047' },
} as const;

interface AboutFeatureCardProps {
  title: string;
  body: string;
  icon: keyof typeof ICON_STYLE;
}

export function AboutFeatureCard({ title, body, icon }: AboutFeatureCardProps) {
  const visual = ICON_STYLE[icon];
  return (
    <article className="settings-about-feature">
      <span
        className="settings-row-icon"
        style={{ '--icon-bg': visual.bg, '--icon-fg': visual.color } as CSSProperties}
      >
        <Icon name={icon} size={20} />
      </span>
      <div>
        <strong>{title}</strong>
        <p>{body}</p>
      </div>
    </article>
  );
}
