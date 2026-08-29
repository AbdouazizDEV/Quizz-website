import { Link } from 'react-router-dom';

import type { ProfileQuizListItem } from '@app-types/profile.types';
import { buildQuizEntryHref } from '@constants/Routes';

interface ProfileQuizCardProps {
  quiz: ProfileQuizListItem;
}

export function ProfileQuizCard({ quiz }: ProfileQuizCardProps) {
  const href = quiz.quizId ? buildQuizEntryHref(quiz.quizId) : undefined;

  const inner = (
    <>
      <img src={quiz.thumbnailUri} alt="" />
      <span>
        <strong>{quiz.title}</strong>
        <p className="gains-footnote">
          {quiz.questionCount} Qs · {quiz.relativeTimeLabel} · {quiz.playCount} parties
        </p>
      </span>
    </>
  );

  if (!href) {
    return <div className="profile-quiz-card">{inner}</div>;
  }

  return (
    <Link to={href} className="profile-quiz-card">
      {inner}
    </Link>
  );
}
