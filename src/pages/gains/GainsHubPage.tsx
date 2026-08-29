import { GainsExpressCta } from '@components/ui/gains/GainsExpressCta';
import { GainsLeaderboardCard } from '@components/ui/gains/GainsLeaderboardCard';
import { GainsNavCard } from '@components/ui/gains/GainsNavCard';
import { GainsPageShell } from '@components/ui/gains/GainsPageShell';
import { GainsRankHero } from '@components/ui/gains/GainsRankHero';
import { GainsStreakBonuses } from '@components/ui/gains/GainsStreakBonuses';
import { GAINS_NAV_CARDS } from '@constants/gainsContent';
import { useGainsHubData } from '@hooks/useGainsHubData';

export function GainsHubPage() {
  const { data, loading, error, refetch } = useGainsHubData();

  if (error && !data) {
    return (
      <GainsPageShell title="Gains">
        <div className="gains-state">
          <p>Impossible de charger tes gains.</p>
          <button type="button" className="gains-retry" onClick={() => void refetch()}>
            Réessayer
          </button>
        </div>
      </GainsPageShell>
    );
  }

  return (
    <GainsPageShell title="Gains">
      <div className="gains-intro">
        <h2 className="gains-intro-title">Classement, récompenses & avantages</h2>
        <p className="gains-intro-sub">Jouez stratégiquement, suivez vos gains et échangez vos points.</p>
      </div>

      {loading && !data ? <p className="gains-footnote">Chargement…</p> : null}

      <div className="gains-hub-split">
        <GainsRankHero
          rank={data?.rank ?? null}
          totalPoints={data?.totalPoints ?? 0}
          pointsToTop3={data?.pointsToTop3 ?? null}
        />
        <div className="gains-hub-side">
          <GainsExpressCta />
          <GainsStreakBonuses streakDays={data?.streakDays ?? 0} />
        </div>
      </div>

      <GainsLeaderboardCard rows={data?.leaderboard ?? []} />

      <section className="gains-explore">
        <h2 className="gains-intro-title gains-explore-title">Explorer</h2>
        <div className="gains-nav-grid">
          {GAINS_NAV_CARDS.map((card) => (
            <GainsNavCard key={card.id} {...card} />
          ))}
        </div>
      </section>
    </GainsPageShell>
  );
}
