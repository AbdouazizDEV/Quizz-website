import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { CategoryExploreGridCard } from '@components/ui/categories/CategoryExploreGridCard';
import { StatisticsNavbar } from '@components/ui/statistics/StatisticsNavbar';
import { Routes } from '@constants/Routes';
import { useCategoriesExplore } from '@hooks/useCategoriesExplore';
import { useAuthStore } from '@stores/authStore';
import { canVisitorAccessCategory, isVisitorSession } from '@services/auth/visitorAccessPolicy';

export function CategoriesPage() {
  const navigate = useNavigate();
  const { data: categories, loading, error, refetch } = useCategoriesExplore();
  const token = useAuthStore((s) => s.token);
  const hasRegisteredAccount = useAuthStore((s) => s.hasRegisteredAccount);

  const onBack = useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(Routes.HOME, { replace: true });
  }, [navigate]);

  const onSearch = useCallback(() => {
    window.alert('Fonctionnalité à venir.');
  }, []);

  const goCategory = useCallback(
    (categorySlug: string, categoryName: string) => {
      if (
        isVisitorSession({ token, hasRegisteredAccount }) &&
        !canVisitorAccessCategory({ slug: categorySlug, name: categoryName })
      ) {
        navigate(Routes.LOGIN);
        return;
      }
      navigate(`${Routes.CATEGORIES}/${categorySlug}`);
    },
    [hasRegisteredAccount, navigate, token],
  );

  if (loading && !categories.length) {
    return (
      <div className="cat-page cat-list-page">
        <div className="cat-centered">
          <div className="cat-spinner" aria-label="Chargement" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cat-page cat-list-page">
        <div className="cat-centered">
          <p className="cat-error">Impossible de charger les catégories.</p>
          <p className="cat-error">{error.message}</p>
          <button type="button" className="cat-retry" onClick={() => void refetch()}>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cat-page cat-list-page">
      <StatisticsNavbar title="Top catégories" onBack={onBack} onSearch={onSearch} />
      {categories.length === 0 ? (
        <p className="cat-empty">Aucune catégorie disponible pour le moment.</p>
      ) : (
        <div className="cat-grid">
          {categories.map((cat) => (
            <CategoryExploreGridCard
              key={cat.id}
              name={cat.name}
              slug={cat.slug}
              onPress={() => goCategory(cat.slug, cat.name)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
