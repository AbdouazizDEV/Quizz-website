import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { DefisRoutes } from '@constants/defisRoutes';
import { useAuthMe } from '@hooks/useAuthMe';
import {
  fetchCompetitionById,
  fetchCompetitionsByTab,
  registerForCompetition,
  unregisterFromCompetition,
} from '@services/defis/competitionRepository';
import { Icon } from '@components/ui/Icon';

export function TournoiListPage() {
  const { data: me } = useAuthMe();
  const { data, isLoading } = useQuery({
    queryKey: ['competitions', 'en_cours', me?.user?.id],
    queryFn: () => fetchCompetitionsByTab('en_cours', me!.user.id),
    enabled: Boolean(me?.user?.id),
  });

  return (
    <div>
      <h1>Tournois</h1>
      {isLoading ? <p>Chargement…</p> : null}
      {(data ?? []).map((item) => (
        <Link key={item.id} to={DefisRoutes.tournoiDetail(item.id)} className="card" style={{ padding: 16, display: 'block', marginBottom: 10 }}>
          <strong>{item.title}</strong>
          <div className="muted">{item.status} · {item.registeredCount} inscrits</div>
        </Link>
      ))}
    </div>
  );
}

export function TournoiDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: me } = useAuthMe();
  const { data, isLoading } = useQuery({
    queryKey: ['competition', id, me?.user?.id],
    queryFn: () => fetchCompetitionById(id!, me!.user.id),
    enabled: Boolean(id && me?.user?.id),
  });

  return (
    <div>
      <button type="button" className="btn btn-ghost" onClick={() => navigate(DefisRoutes.tournoiList)}>
        <Icon name="chevron-left" /> Tournois
      </button>
      <h1>{data?.title ?? 'Tournoi'}</h1>
      {isLoading ? <p>Chargement…</p> : null}
      <p className="muted">{data?.description}</p>
      {data && me?.user?.id ? (
        data.isRegistered ? (
          <button type="button" className="btn btn-ghost" onClick={() => void unregisterFromCompetition(me.user.id, data.id)}>
            Se désinscrire
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={() => void registerForCompetition(me.user.id, data.id)}>
            S’inscrire
          </button>
        )
      ) : null}
      {id ? (
        <Link to={DefisRoutes.tournoiBracket(id)} className="btn btn-outline" style={{ marginTop: 12, display: 'inline-flex' }}>
          Voir le bracket
        </Link>
      ) : null}
    </div>
  );
}

export function TournoiBracketPage() {
  const { id } = useParams();
  return (
    <div>
      <h1>Bracket</h1>
      <p className="muted">Tournoi {id} — le tableau se mettra à jour au fil des matchs.</p>
    </div>
  );
}
