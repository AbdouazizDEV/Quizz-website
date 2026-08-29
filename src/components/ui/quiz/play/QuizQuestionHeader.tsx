import { QuizPlayTheme } from '@constants/quizPlayTheme';

interface QuizQuestionHeaderProps {
  imageUri?: string | null;
  questionText: string;
}

export function QuizQuestionHeader({ imageUri, questionText }: QuizQuestionHeaderProps) {
  const resolvedImage = imageUri?.trim() || null;

  return (
    <div className="quiz-question">
      {resolvedImage ? (
        <div className="quiz-question-media">
          <img src={resolvedImage} alt="" />
        </div>
      ) : null}
      <h2 className="quiz-question-text" style={{ color: QuizPlayTheme.grey900 }}>
        {questionText}
      </h2>
    </div>
  );
}
