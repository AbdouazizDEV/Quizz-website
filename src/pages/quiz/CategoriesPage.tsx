import { Link, useNavigate } from 'react-router-dom';
import { Routes } from '@constants/Routes';
import { buildQuizEntryHref } from '@constants/Routes';
import { useCategoriesExplore } from '@hooks/useCategoriesExplore';
import { Icon } from '@components/ui/Icon';

export function CategoriesPage() {
  const { data, loading, error } = useCategoriesExplore();

  return (
    <div>
      <h1>Jouer</h1>
      <p className="muted">Choisis une catégorie et lance un quiz.</p>
      {loading ? <p>Chargement…</p> : null}
      {error ? <p className="error-text">{error.message}</p> : null}
      <div className="grid-cards" style={{ marginTop: 16 }}>
        {data.map((cat) => (
          <Link key={cat.id} to={`${Routes.CATEGORIES}/${cat.slug}`} className="card" style={{ padding: 18, display: 'block' }}>
            <span style={{ width: 42, height: 42, borderRadius: 14, background: cat.color ?? '#F5A623', display: 'grid', placeItems: 'center', color: '#fff', marginBottom: 12 }}>
              <Icon name={cat.icon ?? 'book-open'} />
            </span>
            <strong>{cat.name}</strong>
            <div className="muted">{cat.quizCount} quiz</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export { buildQuizEntryHref };
