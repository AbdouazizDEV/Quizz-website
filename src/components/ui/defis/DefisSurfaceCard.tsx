import type { ReactNode } from 'react';
import clsx from 'clsx';

interface DefisSurfaceCardProps {
  children: ReactNode;
  className?: string;
}

export function DefisSurfaceCard({ children, className }: DefisSurfaceCardProps) {
  return <div className={clsx('defis-surface-card', className)}>{children}</div>;
}
