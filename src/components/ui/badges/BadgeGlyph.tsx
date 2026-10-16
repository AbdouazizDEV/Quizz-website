import type { WestAfricanBadgeCode } from '@constants/westAfricanBadges';

type Props = { code: WestAfricanBadgeCode; className?: string };

export function BadgeGlyph({ code, className }: Props) {
  const common = {
    viewBox: '0 0 64 64',
    className,
    'aria-hidden': true,
  } as const;

  switch (code) {
    case 'teranga':
      return (
        <svg {...common}>
          <path d="M12 38c0-11 9-20 20-20s20 9 20 20" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="32" cy="40" rx="18" ry="7" fill="currentColor" opacity="0.35" />
          <circle cx="32" cy="22" r="5" fill="currentColor" />
        </svg>
      );
    case 'griot':
      return (
        <svg {...common}>
          <rect x="22" y="14" width="20" height="36" rx="10" fill="currentColor" />
          <rect x="16" y="24" width="8" height="16" rx="3" fill="currentColor" opacity="0.55" />
          <rect x="40" y="24" width="8" height="16" rx="3" fill="currentColor" opacity="0.55" />
        </svg>
      );
    case 'kora':
      return (
        <svg {...common}>
          <circle cx="24" cy="40" r="12" fill="currentColor" opacity="0.35" />
          <path d="M24 28 L48 12" stroke="currentColor" strokeWidth="3" />
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M${26 + i * 2} 40 L${46 - i} 16`} stroke="currentColor" strokeWidth="1.6" />
          ))}
        </svg>
      );
    case 'baobab':
      return (
        <svg {...common}>
          <path d="M30 52 V30" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
          <path d="M30 32 C18 30 16 20 22 16 C26 12 32 14 32 20 C34 12 44 12 46 20 C52 22 50 32 38 32 Z" fill="currentColor" />
        </svg>
      );
    case 'fleuve':
      return (
        <svg {...common}>
          <path d="M10 24 C20 18 28 30 38 24 C48 18 54 26 56 22" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M10 34 C20 28 28 40 38 34 C48 28 54 36 56 32" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M10 44 C20 38 28 50 38 44 C48 38 54 46 56 42" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
        </svg>
      );
    case 'djembe':
      return (
        <svg {...common}>
          <ellipse cx="32" cy="18" rx="14" ry="6" fill="currentColor" />
          <path d="M20 18 L24 34 L40 34 L44 18 Z" fill="currentColor" opacity="0.55" />
          <path d="M24 34 L28 50 H36 L40 34 Z" fill="currentColor" />
        </svg>
      );
    case 'masque':
      return (
        <svg {...common}>
          <path d="M20 16 H44 C48 16 50 22 48 30 C46 44 40 50 32 50 S18 44 16 30 C14 22 16 16 20 16 Z" fill="currentColor" />
          <circle cx="26" cy="30" r="3" fill="#FFD166" />
          <circle cx="38" cy="30" r="3" fill="#FFD166" />
        </svg>
      );
    case 'soleil':
      return (
        <svg {...common}>
          <circle cx="32" cy="32" r="10" fill="currentColor" />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            const x1 = 32 + Math.cos(a) * 15;
            const y1 = 32 + Math.sin(a) * 15;
            const x2 = 32 + Math.cos(a) * 24;
            const y2 = 32 + Math.sin(a) * 24;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="3" strokeLinecap="round" />;
          })}
        </svg>
      );
    case 'lion':
      return (
        <svg {...common}>
          <circle cx="32" cy="32" r="18" fill="currentColor" opacity="0.35" />
          <circle cx="32" cy="33" r="10" fill="currentColor" />
          <circle cx="28" cy="31" r="1.6" fill="#FFD166" />
          <circle cx="36" cy="31" r="1.6" fill="#FFD166" />
        </svg>
      );
    case 'or-sahel':
      return (
        <svg {...common}>
          <circle cx="32" cy="32" r="16" fill="none" stroke="currentColor" strokeWidth="4" />
          <path d="M20 36 L32 18 L44 36 Z" fill="currentColor" />
          <rect x="24" y="38" width="16" height="6" rx="2" fill="currentColor" />
        </svg>
      );
    default:
      return null;
  }
}
