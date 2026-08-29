import type { CategoryExploreItem } from '@app-types/categoryExplore.types';
import { getCategoryCoverUrl } from '@utils/categoryCoverUrl';
import { Icon } from '@components/ui/Icon';

interface HomeDailyCategoriesSectionProps {
  categories: CategoryExploreItem[];
  loading: boolean;
  error?: Error | null;
  onPressCategory: (slug: string) => void;
}

export function HomeDailyCategoriesSection({
  categories,
  loading,
  error,
  onPressCategory,
}: HomeDailyCategoriesSectionProps) {
  if (loading) {
    return <div className="home-loading">Chargement…</div>;
  }

  if (error) {
    return <p className="home-empty-note">{error.message}</p>;
  }

  if (categories.length === 0) {
    return <p className="home-empty-note">Aucune catégorie disponible pour le moment.</p>;
  }

  return (
    <div className="home-cat-col">
      {categories.map((cat) => {
        const cover = getCategoryCoverUrl(cat.slug);
        const meta =
          cat.quizCount === 0
            ? 'Aucun quiz pour l’instant'
            : cat.quizCount === 1
              ? '1 quiz'
              : `${cat.quizCount} quiz`;

        return (
          <button
            key={cat.id}
            type="button"
            className="home-cat-row"
            aria-label={`${cat.name}, ${meta}`}
            onClick={() => onPressCategory(cat.slug)}
          >
            <img src={cover} alt="" className="home-cat-thumb" />
            <div className="home-cat-text">
              <p className="home-cat-name">{cat.name}</p>
              <p className="home-cat-meta">{meta}</p>
            </div>
            <Icon name="chevron-right" size={18} color="#A1A1AA" />
          </button>
        );
      })}
    </div>
  );
}
