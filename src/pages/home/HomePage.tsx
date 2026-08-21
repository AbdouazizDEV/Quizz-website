import { Link, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { Routes, buildUserProfileHref } from '@constants/Routes';
import { DefisRoutes } from '@constants/defisRoutes';
import { HOME_ACTION_TILES } from '@constants/homeActionTiles';
import { useAuthMe } from '@hooks/useAuthMe';
import { useCategoriesExplore } from '@hooks/useCategoriesExplore';
import { useGlobalLeaderboard } from '@hooks/useGlobalLeaderboard';
import { formatLevelCodeLabel, getLevelProgressDetail, initialsFromName, levelCodeFromScore } from '@utils/levelDisplay';
import { Icon } from '@components/ui/Icon';
import { useAuthStore } from '@stores/authStore';
import { canVisitorAccessCategory, isVisitorSession } from '@services/auth/visitorAccessPolicy';

const INSIGHTS = [
  { title: 'Le cerveau adore les quiz courts', body: 'Des sessions de 3 à 5 minutes améliorent la mémorisation.', tag: 'Neurosciences' },
  { title: 'Répondre vite aide la concentration', body: 'Limiter le temps de réponse active l’attention.', tag: 'Productivité' },
  { title: 'La répétition espacée fonctionne', body: 'Rejouer un quiz 24h puis 72h plus tard ancre les connaissances.', tag: 'Méthode' },
];

export function HomePage() {
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const hasRegisteredAccount = useAuthStore((s) => s.hasRegisteredAccount);
  const { data: me } = useAuthMe();
  const { items: leaderboard } = useGlobalLeaderboard(5);
  const { data: categories } = useCategoriesExplore();
  const profile = me?.profile;
  const score = profile?.total_score ?? 0;
  const level = formatLevelCodeLabel(levelCodeFromScore(score));
  const progress = getLevelProgressDetail(score);
  const name = profile?.full_name || profile?.username || 'Joueur';
  const isVisitor = isVisitorSession({ token, hasRegisteredAccount });

  const topCategories = useMemo(() => categories.slice(0, 3), [categories]);

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p className="muted" style={{ margin: 0, fontWeight: 700 }}>Salut</p>
          <h1 style={{ margin: 0, fontSize: 26 }}>{name}</h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to={Routes.SETTINGS_NOTIFICATIONS} className="btn btn-ghost" aria-label="Notifications" style={{ padding: 10 }}>
            <Icon name="bell" />
          </Link>
          <Link to={Routes.SETTINGS} className="btn btn-ghost" aria-label="Paramètres" style={{ padding: 10 }}>
            <Icon name="settings" />
          </Link>
        </div>
      </header>

      <section className="page-hero">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, opacity: 0.9 }}>{level}</div>
            <div style={{ fontSize: 40, fontWeight: 900, lineHeight: 1.1 }}>{score}</div>
            <div style={{ fontWeight: 700 }}>points · série {profile?.streak_days ?? 0} j</div>
          </div>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,.2)', display: 'grid', placeItems: 'center', fontWeight: 900 }}>
            {initialsFromName(name)}
          </div>
        </div>
        <div className="progress-bar" style={{ marginTop: 16 }}>
          <span style={{ width: `${progress.percent}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 8, fontWeight: 700 }}>
          <span>{progress.fromLabel}</span>
          <span>{progress.remainingLabel}</span>
        </div>
      </section>

      <section>
        <h2>Jouer</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {HOME_ACTION_TILES.map((tile) => (
            <button
              key={tile.id}
              type="button"
              className="card"
              style={{ padding: 14, textAlign: 'left', background: '#fff' }}
              onClick={() =>
                navigate(
                  tile.id === 'challenge'
                    ? DefisRoutes.challengeList
                    : tile.id === 'tournament'
                      ? DefisRoutes.tournoiList
                      : DefisRoutes.duelHub,
                )
              }
            >
              <Icon name={tile.icon} color="#E8431A" />
              <div style={{ fontWeight: 800, marginTop: 8 }}>{tile.title}</div>
              <span className="muted" style={{ fontSize: 12 }}>{tile.badge}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Catégories</h2>
          <Link to={Routes.CATEGORIES} style={{ color: '#E8431A', fontWeight: 800 }}>Tout voir</Link>
        </div>
        <div className="grid-cards">
          {topCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className="card"
              style={{ padding: 16, textAlign: 'left', background: '#fff' }}
              onClick={() => {
                if (isVisitor && !canVisitorAccessCategory({ slug: cat.slug })) {
                  navigate(Routes.LOGIN);
                  return;
                }
                navigate(`${Routes.CATEGORIES}/${cat.slug}`);
              }}
            >
              <strong>{cat.name}</strong>
              <div className="muted">{cat.quizCount} quiz</div>
            </button>
          ))}
        </div>
      </section>

      <section className="card" style={{ padding: 18 }}>
        <h2 style={{ marginTop: 0 }}>Savoir du jour</h2>
        {INSIGHTS.map((item) => (
          <article key={item.title} style={{ marginBottom: 14 }}>
            <span style={{ color: '#E8431A', fontWeight: 800, fontSize: 12 }}>{item.tag}</span>
            <h3 style={{ margin: '4px 0' }}>{item.title}</h3>
            <p className="muted" style={{ margin: 0 }}>{item.body}</p>
          </article>
        ))}
      </section>

      <section className="card" style={{ padding: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2 style={{ marginTop: 0 }}>Classement</h2>
          <Link to={Routes.SCOREBOARD} style={{ color: '#E8431A', fontWeight: 800 }}>Voir</Link>
        </div>
        {leaderboard.map((row) => (
          <Link key={row.id} to={buildUserProfileHref(row.id)} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontWeight: 700 }}>
            <span>#{row.rank} {row.displayName}</span>
            <span>{row.score} pts</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
