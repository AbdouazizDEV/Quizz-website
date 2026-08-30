import type { ReactNode } from 'react';

import { SettingsLeadingHeader } from '@components/ui/settings/SettingsLeadingHeader';

interface PremiumPageShellProps {
  title: string;
  onBack: () => void;
  children: ReactNode;
}

export function PremiumPageShell({ title, onBack, children }: PremiumPageShellProps) {
  return (
    <div className="premium-page">
      <div className="premium-inner">
        <SettingsLeadingHeader title={title} onBack={onBack} />
        {children}
      </div>
    </div>
  );
}
