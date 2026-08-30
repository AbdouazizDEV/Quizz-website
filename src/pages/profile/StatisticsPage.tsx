import { useNavigate } from 'react-router-dom';

import { AchievementsSection } from '@components/ui/statistics/AchievementsSection';
import { PerformanceRingCard } from '@components/ui/statistics/PerformanceRingCard';
import { StatisticsNavbar } from '@components/ui/statistics/StatisticsNavbar';
import { WeeklyPointsChartCard } from '@components/ui/statistics/WeeklyPointsChartCard';
import { Routes } from '@constants/Routes';
import { useStatisticsScreenData } from '@hooks/useStatisticsScreenData';

export function StatisticsPage() {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useStatisticsScreenData();

  const onBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate(Routes.PROFILE, { replace: true });
  };

  return (
    <div className="stats-page">
      {loading && !data ? (
        <div className="stats-centered" role="status" aria-label="Chargement">
          <div className="gains-spinner" />
        </div>
      ) : error ? (
        <div className="stats-centered">
          <p className="stats-error">Impossible de charger les statistiques.</p>
          <button type="button" className="stats-retry" onClick={() => void refetch()}>
            Réessayer
          </button>
        </div>
      ) : data ? (
        <>
          <StatisticsNavbar title="Mes statistiques" onBack={onBack} />
          <div className="stats-body">
            <div className="stats-top-board">
              <PerformanceRingCard ratio={data.performanceRatio} label={data.performanceLabel} />
              <WeeklyPointsChartCard weekly={data.weekly} />
            </div>
            <AchievementsSection achievements={data.achievements} />
          </div>
        </>
      ) : null}
    </div>
  );
}
