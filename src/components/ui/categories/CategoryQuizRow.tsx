import type { CategoryQuizListItem } from '@app-types/categoryExplore.types';
import { formatCompactNumber } from '@utils/formatCompactNumber';
import { formatRelativeTimeFr } from '@utils/formatRelativeTimeFr';
import { Icon } from '@components/ui/Icon';

interface CategoryQuizRowProps {
  item: CategoryQuizListItem;
  fallbackThumbnailUri: string;
  lockedForVisitor?: boolean;
  completedByPlayer?: boolean;
  onPress?: () => void;
}

export function CategoryQuizRow({
  item,
  fallbackThumbnailUri,
  lockedForVisitor,
  completedByPlayer,
  onPress,
}: CategoryQuizRowProps) {
  const uri = item.thumbnailUrl?.trim() || fallbackThumbnailUri;
  const meta = `${formatRelativeTimeFr(item.createdAt)} • ${formatCompactNumber(item.playCount)} joueurs`;
  const isLocked = Boolean(lockedForVisitor);
  const isCompleted = Boolean(completedByPlayer);
  const isInteractive = Boolean(onPress) && !isCompleted;

  const rowContent = (
    <div className="cat-quiz-row">
      <div className="cat-quiz-thumb">
        <img src={uri} alt="" />
        <span className="cat-quiz-badge">{item.questionCount} Qs</span>
      </div>
      <div className="cat-quiz-body">
        <p className="cat-quiz-title">{item.title}</p>
        <p className="cat-quiz-meta">{meta}</p>
        <div className="cat-quiz-author">
          <span className="cat-quiz-avatar">Q</span>
          <span className="cat-quiz-author-name">Quizz+</span>
        </div>
      </div>
    </div>
  );

  const lockedVeil = isLocked ? (
    <div className="cat-veil" aria-hidden>
      <span className="cat-filigran" />
      <span className="cat-filigran" />
      <span className="cat-filigran" />
      <div className="cat-veil-center">
        <span className="cat-lock-circle">
          <Icon name="lock" size={20} color="#FFFFFF" />
        </span>
        <p className="cat-veil-title">Connexion requise</p>
        <p className="cat-veil-sub">Connectez-vous pour jouer à ce quiz</p>
      </div>
    </div>
  ) : null;

  const completedVeil = isCompleted ? (
    <div className="cat-veil is-completed" aria-hidden>
      <div className="cat-veil-center">
        <span className="cat-done-circle">
          <Icon name="check" size={20} color="#FFFFFF" />
        </span>
        <p className="cat-veil-title">Terminé</p>
        {item.playerBestScore != null ? (
          <p className="cat-veil-sub">
            {item.maxScore != null && item.maxScore > 0
              ? `${item.playerBestScore}/${item.maxScore} pts`
              : `${item.playerBestScore} pts`}
          </p>
        ) : null}
      </div>
    </div>
  ) : null;

  if (isInteractive) {
    return (
      <button
        type="button"
        className={isLocked ? 'cat-quiz-card is-locked' : 'cat-quiz-card'}
        aria-label={isLocked ? `${item.title}, quiz réservé aux comptes connectés` : item.title}
        onClick={onPress}
      >
        {rowContent}
        {lockedVeil}
      </button>
    );
  }

  return (
    <div
      className={[
        'cat-quiz-card is-static',
        isLocked ? 'is-locked' : '',
        isCompleted ? 'is-completed' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={
        isCompleted
          ? `${item.title}, quiz déjà terminé`
          : isLocked
            ? `${item.title}, quiz réservé aux comptes connectés`
            : item.title
      }
    >
      {rowContent}
      {lockedVeil}
      {completedVeil}
    </div>
  );
}
