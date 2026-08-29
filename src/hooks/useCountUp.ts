import { useEffect, useState } from 'react';

export function useCountUp(value: number, durationMs = 900): number {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const target = Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - (1 - t) ** 3;
      setCurrent(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, durationMs]);

  return current;
}
