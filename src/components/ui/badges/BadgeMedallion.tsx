import { useRef, type ButtonHTMLAttributes, type MouseEvent } from 'react';

import { BadgeGlyph } from '@components/ui/badges/BadgeGlyph';
import {
  BADGE_FINISH,
  isWestAfricanBadgeCode,
  type PlayerBadgeView,
} from '@constants/westAfricanBadges';
import clsx from 'clsx';

type Size = 'sm' | 'md' | 'lg';

interface BadgeMedallionProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  badge: PlayerBadgeView;
  size?: Size;
  celebrate?: boolean;
}

export function BadgeMedallion({
  badge,
  size = 'md',
  celebrate = false,
  className,
  onClick,
  ...rest
}: BadgeMedallionProps) {
  const nodeRef = useRef<HTMLButtonElement>(null);
  const code = isWestAfricanBadgeCode(badge.code) ? badge.code : 'teranga';
  const finish = BADGE_FINISH[code];

  const bounce = (event: MouseEvent<HTMLButtonElement>) => {
    const el = nodeRef.current;
    if (el) {
      el.classList.remove('is-bounce');
      void el.offsetWidth;
      el.classList.add('is-bounce');
    }
    onClick?.(event);
  };

  return (
    <button
      {...rest}
      ref={nodeRef}
      type="button"
      className={clsx(
        'badge-medal',
        `is-${size}`,
        `is-${finish}`,
        badge.earned ? 'is-earned' : 'is-locked',
        celebrate && 'is-celebrate',
        className,
      )}
      onClick={bounce}
      aria-label={`${badge.name}, ${badge.motif}. ${badge.earned ? 'Obtenu' : 'À gagner'}`}
    >
      <span className="badge-medal-scene">
        <span className="badge-medal-spin">
          <span className="badge-medal-disc">
            <span className="badge-medal-rim" />
            <span className="badge-medal-face">
              <BadgeGlyph code={code} className="badge-medal-glyph" />
            </span>
            <span className="badge-medal-shine" />
          </span>
        </span>
      </span>
    </button>
  );
}
