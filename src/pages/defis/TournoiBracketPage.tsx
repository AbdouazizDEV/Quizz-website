import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { CompetitionBracketView } from '@components/ui/defis/CompetitionBracketView';
import { CompetitionHeroBanner } from '@components/ui/defis/CompetitionHeroBanner';
import { DefisNavbar } from '@components/ui/defis/DefisNavbar';
import { DefisRoutes } from '@constants/defisRoutes';
import { useAuthMe } from '@hooks/useAuthMe';
import {
  fetchCompetitionBracket,
  fetchCompetitionById,
} from '@services/defis/competitionRepository';

export function TournoiBracketPage() {
  const { id } = useParams();
  const competitionId = id?.trim() ?? '';
  const navigate = useNavigate();
  const { data: me, loading: meLoading } = useAuthMe();
  const userId = me?.user?.id ?? '';

  const competitionQuery = useQuery({
    queryKey: ['competition', competitionId, userId || 'guest'],
    queryFn: () => fetchCompetitionById(competitionId, userId || 'guest'),
    enabled: Boolean(competitionId),
  });

  const bracketQuery = useQuery({
    queryKey: ['competition-bracket', competitionId],
    queryFn: () => fetchCompetitionBracket(competitionId),
    enabled: Boolean(competitionId),
  });

  const isLoading = meLoading || competitionQuery.isLoading || bracketQuery.isLoading;
  const canShow =
    Boolean(competitionQuery.data) || Boolean(bracketQuery.data && !bracketQuery.isError);
  const isError = !isLoading && (bracketQuery.isError || !canShow);

  return (
    <div className="defis-page defis-page--shell">
      <DefisNavbar
        title="Bracket"
        onBack={() =>
          navigate(competitionId ? DefisRoutes.tournoiDetail(competitionId) : DefisRoutes.tournoiList)
        }
      />

      {isLoading ? (
        <div className="tournoi-list-loader" role="status" aria-label="Chargement">
          <div className="defis-spinner is-primary" />
        </div>
      ) : null}

      {!isLoading && isError ? (
        <p className="tournoi-list-empty">Impossible de charger ce bracket.</p>
      ) : null}

      {!isLoading && !isError ? (
        <>
          {competitionQuery.data ? (
            <CompetitionHeroBanner
              competition={competitionQuery.data}
              subtitle="Arbre du tournoi · élimination directe"
            />
          ) : null}
          {bracketQuery.data ? (
            <CompetitionBracketView
              bracket={bracketQuery.data}
              currentUserId={userId || undefined}
            />
          ) : (
            <p className="bracket-empty-hint">
              Le tableau se mettra à jour au fil des matchs.
            </p>
          )}
        </>
      ) : null}
    </div>
  );
}
