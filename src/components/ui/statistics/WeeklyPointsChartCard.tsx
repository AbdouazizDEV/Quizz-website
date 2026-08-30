import { useMemo, type CSSProperties } from 'react';

import type { WeeklySeriesSummary } from '@app-types/statistics.types';

const X_LABELS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'] as const;

interface WeeklyPointsChartCardProps {
  weekly: WeeklySeriesSummary;
}

export function WeeklyPointsChartCard({ weekly }: WeeklyPointsChartCardProps) {
  const values = weekly.points
    .slice()
    .sort((a, b) => a.dayIndex - b.dayIndex)
    .map((p) => p.value);
  const max = Math.max(weekly.yMax, 1);
  const yTicks = useMemo(() => [max, Math.round(max / 2), 0], [max]);

  return (
    <section className="stats-week-card gains-fade">
      <div className="stats-week-head">
        <p className="stats-week-label">{weekly.label}</p>
        <strong>{weekly.totalPointsFormatted}</strong>
      </div>
      <div className="stats-week-chart-row">
        <div className="stats-week-yaxis" aria-hidden>
          {yTicks.map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>
        <div className="stats-week-plot">
          <div className="stats-week-chart">
            {X_LABELS.map((label, index) => {
              const value = values[index] ?? 0;
              const pct = Math.max(6, Math.round((value / max) * 100));
              return (
                <div key={label} className="stats-week-col">
                  <span
                    className="stats-week-bar"
                    style={{ '--bar-h': `${pct}%` } as CSSProperties}
                  />
                </div>
              );
            })}
          </div>
          <div className="stats-week-xaxis">
            {X_LABELS.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
