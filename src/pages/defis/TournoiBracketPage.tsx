import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { CompetitionBracketView } from '@components/ui/defis/CompetitionBracketView';
import { DefisNavbar } from '@components/ui/defis/DefisNavbar';
import { DefisStateViews } from '@components/ui/defis/DefisStateViews';
import { DefisRoutes } from '@constants/defisRoutes';
import { fetchCompetitionBracket } from '@services/defis/competitionRepository';

export function TournoiBracketPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['competition-bracket', id],
    queryFn: () => fetchCompetitionBracket(id!),
    enabled: Boolean(id),
  });

  return (
    <div className="defis-page">
      <DefisNavbar title="Bracket" onBack={() => navigate(id ? DefisRoutes.tournoiDetail(id) : DefisRoutes.tournoiList)} />
      {isLoading ? <DefisStateViews loading /> : null}
      {error ? (
        <DefisStateViews
          error={error instanceof Error ? error : 'Impossible de charger le bracket.'}
          onRetry={() => void refetch()}
        />
      ) : null}
      {data ? <CompetitionBracketView bracket={data} /> : null}
    </div>
  );
}
