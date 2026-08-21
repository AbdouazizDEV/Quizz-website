import { Link, useParams } from 'react-router-dom';
import { Routes } from '@constants/Routes';
import { useAuthMe } from '@hooks/useAuthMe';
import { useProfileScreenData } from '@hooks/useProfileScreenData';
import { useStatisticsScreenData } from '@hooks/useStatisticsScreenData';
import { useGlobalLeaderboard } from '@hooks/useGlobalLeaderboard';
import { Icon } from '@components/ui/Icon';

export function ProfilePage() {
  const { data: me } = useAuthMe();
  const { data, loading } = useProfileScreenData(me?.user?.id);
  return (
    <div>
      <div className="page-hero">
        <img src={data?.identity.avatarUri} alt="" width={72} height={72} style={{ borderRadius: '50%' }} />
        <h1>{data?.identity.displayName ?? me?.profile?.username}</h1>
        <p>{data?.identity.handle}</p>
      </div>
      {loading ? <p>Chargement…</p> : null}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 16 }}>
        {data?.stats.map((s) => (
          <div key={s.id} className="card" style={{ padding: 12, textAlign: 'center' }}>
            <strong>{s.valueLabel}</strong>
            <div className="muted">{s.caption}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <Link to={Routes.STATISTICS} className="btn btn-ghost">Stats</Link>
        <Link to={Routes.NETWORK} className="btn btn-ghost">Réseau</Link>
        <Link to={Routes.SETTINGS} className="btn btn-ghost">Réglages</Link>
      </div>
      <h2>Historique quiz</h2>
      {data?.quizzes.map((q) => (
        <div key={q.id} className="card" style={{ padding: 12, marginBottom: 8 }}>
          <strong>{q.title}</strong>
          <div className="muted">{q.questionCount} questions · {q.relativeTimeLabel}</div>
        </div>
      ))}
    </div>
  );
}

export function UserProfilePage() {
  const { userId } = useParams();
  const { data, loading } = useProfileScreenData(userId);
  return (
    <div>
      <h1>{data?.identity.displayName ?? 'Joueur'}</h1>
      {loading ? <p>Chargement…</p> : null}
      <p className="muted">{data?.identity.handle}</p>
    </div>
  );
}

export function StatisticsPage() {
  const { data: me } = useAuthMe();
  const { data, loading } = useStatisticsScreenData(me?.user?.id);
  const ratio = Math.round((data?.performanceRatio ?? 0) * 100);
  return (
    <div>
      <h1>Statistiques</h1>
      {loading ? <p>Chargement…</p> : null}
      <div className="card" style={{ padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 48, fontWeight: 900, color: '#E8431A' }}>{ratio}%</div>
        <p>{data?.performanceLabel ?? 'Performance'}</p>
      </div>
      <h2>Semaine</h2>
      <div className="card" style={{ padding: 16, display: 'flex', alignItems: 'flex-end', gap: 8, height: 160 }}>
        {(data?.weekly.points ?? []).map((p) => (
          <div key={p.dayIndex} style={{ flex: 1, background: 'linear-gradient(#E8431A,#F5A623)', height: `${Math.max(8, (p.value / (data?.weekly.yMax || 1)) * 100)}%`, borderRadius: 8 }} />
        ))}
      </div>
      <h2>Succès</h2>
      {data?.achievements.map((a) => (
        <div key={a.id} className="card" style={{ padding: 12, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
          <span>{a.label}</span>
          <strong>{a.valueFormatted}</strong>
        </div>
      ))}
    </div>
  );
}

export function ScoreboardPage() {
  const { items, me, loading } = useGlobalLeaderboard(50);
  return (
    <div>
      <h1>Classement</h1>
      {loading ? <p>Chargement…</p> : null}
      {me?.rank ? <p className="muted">Ton rang : #{me.rank}</p> : null}
      {items.map((row) => (
        <Link key={row.id} to={`/users/${row.id}`} className="card" style={{ padding: 12, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
          <span>#{row.rank} {row.displayName}</span>
          <strong>{row.score} pts</strong>
        </Link>
      ))}
      <Icon name="trophy" />
    </div>
  );
}
