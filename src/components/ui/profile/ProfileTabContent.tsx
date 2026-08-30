import { useMemo, useState } from 'react';

import type { ProfileQuizListItem, ProfileTabId } from '@app-types/profile.types';
import { ProfileQuizCard } from '@components/ui/profile/ProfileQuizCard';
import { ProfileQuizzListHeader } from '@components/ui/profile/ProfileQuizzListHeader';

const INITIAL_VISIBLE = 10;

interface ProfileTabContentProps {
  tab: ProfileTabId;
  quizTotalCount: number;
  quizzes: ProfileQuizListItem[];
}

export function ProfileTabContent({ tab, quizTotalCount, quizzes }: ProfileTabContentProps) {
  const [expanded, setExpanded] = useState(false);
  const visibleQuizzes = useMemo(
    () => (expanded ? quizzes : quizzes.slice(0, INITIAL_VISIBLE)),
    [expanded, quizzes],
  );
  const hasMore = quizzes.length > INITIAL_VISIBLE;
  const displayCount = Math.max(quizTotalCount, quizzes.length);

  if (tab === 'collections') {
    return <p className="profile-placeholder">Vos trophées apparaîtront ici.</p>;
  }

  if (tab === 'about') {
    return <p className="profile-placeholder">À propos — contenu à venir.</p>;
  }

  return (
    <div className="profile-quizz-panel">
      <ProfileQuizzListHeader title={`${displayCount} quiz`} sortLabel="Plus récents" />
      {visibleQuizzes.length === 0 ? (
        <p className="profile-placeholder">Aucune partie récente à afficher pour le moment.</p>
      ) : (
        <div className="profile-quiz-list">
          {visibleQuizzes.map((quiz) => (
            <ProfileQuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      )}
      {hasMore ? (
        <button type="button" className="profile-more" onClick={() => setExpanded((v) => !v)}>
          {expanded ? 'Réduire' : 'Voir plus'}
        </button>
      ) : null}
    </div>
  );
}
