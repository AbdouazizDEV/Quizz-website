import { Link, useNavigate, useParams } from 'react-router-dom';
import { buildQuizEntryHref, Routes } from '@constants/Routes';
import { useCategoryDetail } from '@hooks/useCategoryDetail';
import { Icon } from '@components/ui/Icon';

export function CategoryDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useCategoryDetail(slug, 'default');

  return (
    <div>
      <button type="button" className="btn btn-ghost" onClick={() => navigate(Routes.CATEGORIES)}>
        <Icon name="chevron-left" /> Catégories
      </button>
      <h1>{data?.category.name ?? 'Catégorie'}</h1>
      {loading ? <p>Chargement…</p> : null}
      {error ? <p className="error-text">{error.message}</p> : null}
      <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
        {data?.quizzes.map((quiz) => (
          <Link
            key={quiz.id}
            to={buildQuizEntryHref(quiz.id, { categorySlug: slug })}
            className="card"
            style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div>
              <strong>{quiz.title}</strong>
              <div className="muted">
                {quiz.questionCount} questions · {quiz.difficultyLevel ?? 'libre'}
              </div>
            </div>
            <Icon name="play" color="#E8431A" />
          </Link>
        ))}
      </div>
    </div>
  );
}
