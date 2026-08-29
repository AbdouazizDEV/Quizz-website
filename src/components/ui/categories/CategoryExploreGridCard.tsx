import { getCategoryCoverUrl } from '@utils/categoryCoverUrl';

interface CategoryExploreGridCardProps {
  name: string;
  slug: string;
  onPress: () => void;
}

export function CategoryExploreGridCard({ name, slug, onPress }: CategoryExploreGridCardProps) {
  const uri = getCategoryCoverUrl(slug);

  return (
    <button
      type="button"
      className="cat-grid-card"
      aria-label={`Catégorie ${name}`}
      onClick={onPress}
    >
      <img src={uri} alt="" />
      <span className="cat-grid-card-fade">
        <span className="cat-grid-card-title">{name}</span>
      </span>
    </button>
  );
}
