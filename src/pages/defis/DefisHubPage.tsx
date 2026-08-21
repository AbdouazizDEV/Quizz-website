import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { DefisRoutes } from '@constants/defisRoutes';
import { DEFIS_DUEL_SECTION, DEFIS_MONTHLY_TOURNAMENT, DEFIS_WEEKLY_CHALLENGE } from '@constants/defisContent';
import { Routes } from '@constants/Routes';
import { useAuthMe } from '@hooks/useAuthMe';
import { useDefisDashboard } from '@hooks/defis/useDefisDashboard';
import { Icon } from '@components/ui/Icon';

export function DefisHubPage() {
  const { data: me } = useAuthMe();
  const { data } = useDefisDashboard(me?.user?.id);

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h1>Défis</h1>
      <Link to={DefisRoutes.challengeList} className="page-hero" style={{ display: 'block' }}>
        <div style={{ fontSize: 13, fontWeight: 800 }}>{DEFIS_WEEKLY_CHALLENGE.eyebrow}</div>
        <h2>{data?.currentWeekChallenge?.title ?? DEFIS_WEEKLY_CHALLENGE.title}</h2>
        <p>{data?.activeChallengeCount ?? 0} challenge(s) actif(s)</p>
      </Link>
      <Link to={DefisRoutes.tournoiList} className="card" style={{ padding: 18, display: 'block' }}>
        <strong>{DEFIS_MONTHLY_TOURNAMENT.eyebrow}</strong>
        <h2>{DEFIS_MONTHLY_TOURNAMENT.title}</h2>
        <p className="muted">{data?.activeTournamentCount ?? 0} tournoi(s) en cours</p>
      </Link>
      <Link to={DefisRoutes.duelHub} className="card" style={{ padding: 18, display: 'flex', gap: 12, alignItems: 'center' }}>
        <Icon name="zap" color="#E8431A" />
        <div>
          <strong>{DEFIS_DUEL_SECTION.title}</strong>
          <div className="muted">{data?.pendingDuelCount ?? 0} duel(s) en attente</div>
        </div>
      </Link>
      <Link to={Routes.SCOREBOARD} className="btn btn-ghost">Voir le classement</Link>
    </div>
  );
}
