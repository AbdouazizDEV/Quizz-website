/** POST Nest : /quizzes/:quizId/complete */
export function quizCompleteApiPath(quizId: string): string {
  return `/quizzes/${quizId}/complete`;
}

export interface QuizSessionCompleteBody {
  score: number;
  answers?: { questionId: string; selected: string; correct: boolean }[];
}

export interface QuizSessionCompleteResponse {
  session_id: string;
  score: number;
  total_score: number;
  quizzes_completed: number;
}
