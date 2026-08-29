/** POST Nest : /quizzes/:quizId/complete */
export function quizCompleteApiPath(quizId: string): string {
  return `/quizzes/${encodeURIComponent(quizId)}/complete`;
}

export function isQuizCompleteApiPath(path: string): boolean {
  return /\/quizzes\/[^/]+\/complete\/?$/i.test(path.split('?')[0] ?? path);
}

export function isLegacyQuizSessionCompleteUrl(url: string): boolean {
  return (
    url === 'supabase://quiz_sessions/complete' ||
    url.includes('quiz_sessions/complete') ||
    url.includes('supabase://quiz_sessions')
  );
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

function readFiniteNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

export function parseQuizCompleteResponse(raw: unknown): {
  total_score: number;
  quizzes_completed: number;
} | null {
  if (!raw || typeof raw !== 'object') return null;
  const row = raw as Record<string, unknown>;
  const nested =
    row.data && typeof row.data === 'object' ? (row.data as Record<string, unknown>) : row;
  const totalScore = readFiniteNumber(nested.total_score ?? nested.totalScore);
  if (totalScore === undefined) return null;
  return {
    total_score: totalScore,
    quizzes_completed: readFiniteNumber(nested.quizzes_completed ?? nested.quizzesCompleted) ?? 0,
  };
}
