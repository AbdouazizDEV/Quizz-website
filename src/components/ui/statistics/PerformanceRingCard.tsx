import { ProfileCircularPerformance } from '@components/ui/profile/ProfileCircularPerformance';

interface PerformanceRingCardProps {
  ratio: number;
  label: string;
  hint?: string;
}

export function PerformanceRingCard({
  ratio,
  label,
  hint = 'Basé sur tes quiz, série et score',
}: PerformanceRingCardProps) {
  return (
    <section className="stats-ring-card gains-fade">
      <h2>Performance</h2>
      <p>{hint}</p>
      <div className="stats-ring-wrap">
        <div className="stats-ring-plate">
          <ProfileCircularPerformance ratio={ratio} label={label} size={156} animated animationDelayMs={220} />
        </div>
      </div>
    </section>
  );
}
