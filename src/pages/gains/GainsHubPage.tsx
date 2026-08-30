import { GainsExpressCta } from '@components/ui/gains/GainsExpressCta';
import { GainsLeaderboardCard } from '@components/ui/gains/GainsLeaderboardCard';
import { GainsNavCard } from '@components/ui/gains/GainsNavCard';
import { GainsPageShell } from '@components/ui/gains/GainsPageShell';
import { GainsRankHero } from '@components/ui/gains/GainsRankHero';
import { GainsStreakBonuses } from '@components/ui/gains/GainsStreakBonuses';
import { GAINS_NAV_CARDS } from '@constants/gainsContent';
import { Routes } from '@constants/Routes';
import { useGainsHubData } from '@hooks/useGainsHubData';

export function GainsHubPage() {
  const { data, loading, error, refetch } = useGainsHubData();

  return (
    <GainsPageShell title="Gains">
      <div className="gains-intro gains-fade">
        <h2 className="gains-intro-title">Classement, récompenses & avantages</h2>
        <p className="gains-intro-sub">
          Jouez stratégiquement, suivez vos gains et échangez vos points.
        </p>
      </div>

      {loading && !data ? (
        <div className="gains-state" role="status" aria-label="Chargement">
          <div className="gains-spinner" />
        </div>
      ) : null}

      {error && !data ? (
        <div className="gains-state">
          <p>Impossible de charger tes gains.</p>
          <button type="button" className="gains-retry" onClick={() => void refetch()}>
            Réessayer
          </button>
        </div>
      ) : null}

      {data ? (
        <div className="gains-hub-body">
          <div className="gains-hub-board">
            <div className="gains-hub-main">
              <GainsRankHero
                rank={data.rank}
                totalPoints={data.totalPoints}
                pointsToTop3={data.pointsToTop3}
              />
              <GainsExpressCta />
              <GainsStreakBonuses streakDays={data.streakDays} />
            </div>
            <div className="gains-hub-aside">
              <GainsLeaderboardCard rows={data.leaderboard} seeAllHref={Routes.SCOREBOARD} />
            </div>
          </div>

          <section className="gains-hub-explore">
            <h2 className="gains-explore-title gains-fade" style={{ animationDelay: '180ms' }}>
              Explorer
            </h2>
            <div className="gains-nav-list">
              {GAINS_NAV_CARDS.map((card) => (
                <GainsNavCard key={card.id} {...card} />
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </GainsPageShell>
  );
}
