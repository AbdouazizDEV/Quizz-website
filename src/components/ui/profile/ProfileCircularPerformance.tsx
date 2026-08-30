import { useEffect, useState, type CSSProperties } from 'react';

interface ProfileCircularPerformanceProps {
  ratio: number;
  label?: string;
  size?: number;
  animated?: boolean;
  animationDelayMs?: number;
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

export function ProfileCircularPerformance({
  ratio,
  label = 'Perf.',
  size = 88,
  animated = true,
  animationDelayMs = 120,
}: ProfileCircularPerformanceProps) {
  const stroke = Math.max(8, Math.round(size * 0.1));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.min(1, Math.max(0, ratio));
  const [progress, setProgress] = useState(animated ? 0 : clamped);

  useEffect(() => {
    if (!animated) {
      setProgress(clamped);
      return;
    }
    setProgress(0);
    let raf = 0;
    const startTimer = window.setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 1150);
        setProgress(clamped * easeOutCubic(t));
        if (t < 1) raf = requestAnimationFrame(tick);
        else setProgress(clamped);
      };
      raf = requestAnimationFrame(tick);
    }, animationDelayMs);
    return () => {
      window.clearTimeout(startTimer);
      cancelAnimationFrame(raf);
    };
  }, [animated, animationDelayMs, clamped]);

  const offset = c * (1 - progress);
  const percent = Math.round(progress * 100);

  return (
    <div
      className={animated ? 'profile-perf-ring is-animated' : 'profile-perf-ring'}
      style={
        {
          '--ring-size': `${size}px`,
          '--ring-center': `${Math.max(16, Math.round(size * 0.18))}px`,
          '--ring-caption': `${Math.max(10, Math.round(size * 0.09))}px`,
          '--ring-delay': `${animationDelayMs}ms`,
        } as CSSProperties
      }
    >
      <svg viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ECECEC" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#FFB703"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="profile-perf-ring-label">
        <strong>{percent}%</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}
