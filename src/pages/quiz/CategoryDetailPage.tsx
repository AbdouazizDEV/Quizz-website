import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { CategoryQuizRow } from '@components/ui/categories/CategoryQuizRow';
import { ProfileQuizzListHeader } from '@components/ui/profile/ProfileQuizzListHeader';
import { StatisticsNavbar } from '@components/ui/statistics/StatisticsNavbar';
import type { QuizSortMode } from '@app-types/categoryExplore.types';
import { buildQuizEntryHref, Routes } from '@constants/Routes';
import { useCategoryDetail } from '@hooks/useCategoryDetail';
import { getCategoryCoverUrl } from '@utils/categoryCoverUrl';
import { useAuthStore } from '@stores/authStore';
import { isQuizDifficultyDefined, lacksAuthToken } from '@services/auth/visitorAccessPolicy';

export function CategoryDetailPage() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [sort, setSort] = useState<QuizSortMode>('default');
  const sortLabel = sort === 'default' ? 'Par défaut' : 'Plus récents';
  const { data, loading, error, refetch } = useCategoryDetail(slug, sort);
  const token = useAuthStore((s) => s.token);
  const coverUri = useMemo(() => (slug ? getCategoryCoverUrl(slug) : ''), [slug]);

  const onBack = useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(Routes.CATEGORIES, { replace: true });
  }, [navigate]);

  const onSearch = useCallback(() => {
    window.alert('Fonctionnalité à venir.');
  }, []);

  const onPressQuiz = useCallback(
    (quizId: string, difficultyLevel: string | null, isCompletedByPlayer?: boolean) => {
      if (isCompletedByPlayer) return;
      if (lacksAuthToken(token) && isQuizDifficultyDefined(difficultyLevel)) {
        navigate(Routes.LOGIN);
        return;
      }
      navigate(buildQuizEntryHref(quizId, { categorySlug: slug }));
    },
    [navigate, slug, token],
  );

  if (!slug) {
    return (
      <div className="cat-page is-detail">
        <div className="cat-centered">
          <p className="cat-error">Catégorie introuvable.</p>
        </div>
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div className="cat-page is-detail">
        <div className="cat-centered">
          <div className="cat-spinner" aria-label="Chargement" />
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="cat-page is-detail">
        <div className="cat-centered">
          <p className="cat-error">{error.message}</p>
          <button type="button" className="cat-retry" onClick={() => void refetch()}>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="cat-page is-detail">
      <StatisticsNavbar title={data.category.name} onBack={onBack} onSearch={onSearch} />
      <img className="cat-hero" src={coverUri} alt="" />
      <div className="cat-quiz-wrap">
        <ProfileQuizzListHeader
          title={`${data.category.quizCount} Quizz`}
          sortLabel={sortLabel}
          onPressSort={() => setSort((prev) => (prev === 'default' ? 'newest' : 'default'))}
        />
        <div className="cat-quiz-list">
          {data.quizzes.length === 0 ? (
            <p className="cat-empty">Aucun quiz publié dans cette catégorie pour le moment.</p>
          ) : (
            data.quizzes.map((quiz) => (
              <CategoryQuizRow
                key={quiz.id}
                item={quiz}
                fallbackThumbnailUri={coverUri}
                lockedForVisitor={lacksAuthToken(token) && isQuizDifficultyDefined(quiz.difficultyLevel)}
                completedByPlayer={quiz.isCompletedByPlayer}
                onPress={
                  quiz.isCompletedByPlayer
                    ? undefined
                    : () => onPressQuiz(quiz.id, quiz.difficultyLevel, quiz.isCompletedByPlayer)
                }
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
