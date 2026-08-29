import type { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface WalkthroughActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant: 'primary' | 'secondary';
}

export function WalkthroughActionButton({
  label,
  variant,
  className,
  type = 'button',
  ...props
}: WalkthroughActionButtonProps) {
  return (
    <button
      type={type}
      className={clsx('auth-btn', variant === 'primary' ? 'auth-btn-primary' : 'auth-btn-secondary', className)}
      {...props}
    >
      {label}
    </button>
  );
}
