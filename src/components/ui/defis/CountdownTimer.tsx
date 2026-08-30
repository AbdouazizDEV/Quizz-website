import { useEffect, useState } from 'react';
import clsx from 'clsx';

interface CountdownTimerProps {
  endsAt: string;
  /** Texte clair sur fond sombre (bannière tournoi). */
  light?: boolean;
  /** Affiche « Se termine dans … » ; désactivé si un libellé est déjà au-dessus. */
  showPrefix?: boolean;
  className?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isUrgent: boolean;
  expired: boolean;
}

function getTimeRemaining(endsAt: string): TimeRemaining {
  const now = Date.now();
  const end = new Date(endsAt).getTime();
  const safeDiff = Number.isFinite(end) ? Math.max(0, end - now) : 0;

  const days = Math.floor(safeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((safeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((safeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((safeDiff % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    isUrgent: safeDiff > 0 && safeDiff < 60 * 60 * 1000,
    expired: safeDiff === 0,
  };
}

function formatTimeCore(time: TimeRemaining): string {
  if (time.expired) return 'Expiré';
  if (time.days > 0) return `${time.days}j ${time.hours}h`;
  if (time.hours > 0) return `${time.hours}h ${time.minutes}m`;
  if (time.minutes > 0) {
    return `${time.minutes}m ${String(time.seconds).padStart(2, '0')}s`;
  }
  return `${time.seconds}s`;
}

function formatLabel(time: TimeRemaining, showPrefix: boolean): string {
  const core = formatTimeCore(time);
  if (time.expired || !showPrefix) return core;
  return `Se termine dans ${core}`;
}

export function CountdownTimer({
  endsAt,
  light = false,
  showPrefix = true,
  className,
}: CountdownTimerProps) {
  const [time, setTime] = useState(() => getTimeRemaining(endsAt));

  useEffect(() => {
    const tick = () => setTime(getTimeRemaining(endsAt));
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [endsAt]);

  const prefixIcon = !showPrefix || time.expired ? '⏱ ' : showPrefix ? '📅 ' : '';

  return (
    <span
      className={clsx(
        'defis-countdown',
        light && 'is-light',
        time.isUrgent && !time.expired && 'is-urgent',
        time.expired && 'is-expired',
        className,
      )}
    >
      {prefixIcon}
      {formatLabel(time, showPrefix)}
    </span>
  );
}
