import { useAuthMe } from '@hooks/useAuthMe';
import { useStatisticsScreenData } from '@hooks/useStatisticsScreenData';
import { ProfileView } from './ProfileView';

export function ProfilePage() {
  return <ProfileView />;
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
          <div
            key={p.dayIndex}
            style={{
              flex: 1,
              background: 'linear-gradient(#E8431A,#F5A623)',
              height: `${Math.max(8, (p.value / (data?.weekly.yMax || 1)) * 100)}%`,
              borderRadius: 8,
            }}
          />
        ))}
      </div>
      <h2>Succès</h2>
      {data?.achievements.map((a) => (
        <div
          key={a.id}
          className="card"
          style={{ padding: 12, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}
        >
          <span>{a.label}</span>
          <strong>{a.valueFormatted}</strong>
        </div>
      ))}
    </div>
  );
}
