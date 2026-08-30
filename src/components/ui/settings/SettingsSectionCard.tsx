import type { ReactNode } from 'react';

interface SettingsSectionCardProps {
  title?: string;
  children: ReactNode;
}

export function SettingsSectionCard({ title, children }: SettingsSectionCardProps) {
  return (
    <section className="settings-section gains-fade">
      <div className="settings-section-body">
        {title ? <h2>{title}</h2> : null}
        {children}
      </div>
    </section>
  );
}
