import { Link } from 'react-router-dom';
import { GainsRoutes } from '@constants/gainsRoutes';
import { GAINS_CASH_PRIZES, GAINS_HOW_STEPS, GAINS_REWARD_CATALOG, GAINS_STREAK_TIERS } from '@constants/gainsContent';
import { Routes } from '@constants/Routes';
import { useGainsHubData } from '@hooks/useGainsHubData';
import { Icon } from '@components/ui/Icon';

export function GainsHubPage() {
  const { data, loading } = useGainsHubData();
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <section className="page-hero">
        <div style={{ fontWeight: 800 }}>Rang {data?.rank ?? '—'}</div>
        <div style={{ fontSize: 40, fontWeight: 900 }}>{data?.totalPoints ?? 0} pts</div>
        {data?.pointsToTop3 ? <p>Encore {data.pointsToTop3} pts pour le Top 3</p> : <p>Tu es dans le Top 3 🔥</p>}
      </section>
      {loading ? <p>Chargement…</p> : null}
      <Link to={Routes.CATEGORIES} className="btn btn-primary">Quiz Express</Link>
      <div className="grid-cards">
        <Link to={GainsRoutes.howToWin} className="card" style={{ padding: 16, display: 'block' }}>Comment gagner</Link>
        <Link to={GainsRoutes.prizes} className="card" style={{ padding: 16, display: 'block' }}>Prix</Link>
        <Link to={GainsRoutes.rewards} className="card" style={{ padding: 16, display: 'block' }}>Récompenses</Link>
        <Link to={GainsRoutes.myEarnings} className="card" style={{ padding: 16, display: 'block' }}>Mes gains</Link>
      </div>
      <section className="card" style={{ padding: 16 }}>
        <h2>Série</h2>
        {GAINS_STREAK_TIERS.map((t) => (
          <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontWeight: 700 }}>
            <span>{t.label}</span>
            <span>{t.hint}</span>
          </div>
        ))}
      </section>
    </div>
  );
}

export function GainsHowPage() {
  return (
    <div>
      <h1>Comment gagner</h1>
      {GAINS_HOW_STEPS.map((s) => (
        <article key={s.id} className="card" style={{ padding: 16, marginBottom: 12 }}>
          <Icon name={s.icon} color="#E8431A" />
          <h2>{s.title}</h2>
          <p className="muted">{s.body}</p>
        </article>
      ))}
    </div>
  );
}

export function GainsPrizesPage() {
  return (
    <div>
      <h1>Prix cash</h1>
      {GAINS_CASH_PRIZES.map((p) => (
        <article key={p.id} className="page-hero" style={{ marginBottom: 12 }}>
          <strong>{p.periodLabel}</strong>
          <h2>{p.amountLabel}</h2>
          <p>{p.rankLabel}</p>
        </article>
      ))}
    </div>
  );
}

export function GainsRewardsPage() {
  return (
    <div>
      <h1>Récompenses</h1>
      {GAINS_REWARD_CATALOG.map((r) => (
        <div key={r.id} className="card" style={{ padding: 16, marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <strong>{r.title}</strong>
            <div className="muted">{r.category}</div>
          </div>
          <strong>{r.costPoints} pts</strong>
        </div>
      ))}
    </div>
  );
}

export function GainsMyPage() {
  const { data } = useGainsHubData();
  return (
    <div>
      <h1>Mes gains</h1>
      {(data?.historyPreview ?? []).map((h) => (
        <div key={h.id} className="card" style={{ padding: 14, marginBottom: 8 }}>
          <strong>{h.title}</strong>
          <div className="muted">{h.subtitle} · {h.whenLabel}</div>
        </div>
      ))}
      <Link to={Routes.CATEGORIES} className="btn btn-primary" style={{ marginTop: 12 }}>
        Quiz Express
      </Link>
    </div>
  );
}
