import type { AuthMeResponse } from '@sdk';
import type { components } from '@sdk';

type AuthUser = components['schemas']['AuthUser'];

/** Préremplit le cache `auth/me` depuis la réponse login (avant le GET /auth/me complet). */
export function mapLoginUserToAuthMe(user: AuthUser): AuthMeResponse {
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const userId = user.id ?? '';

  return {
    user,
    profile: {
      id: userId,
      username: String(meta.username ?? '').trim() || 'Joueur',
      full_name: typeof meta.full_name === 'string' ? meta.full_name : null,
      avatar_url: null,
      level_code: typeof meta.level_code === 'string' ? meta.level_code : 'Z0',
      total_score: typeof meta.total_score === 'number' ? meta.total_score : 0,
      quizzes_completed: typeof meta.quizzes_completed === 'number' ? meta.quizzes_completed : 0,
      days_active: typeof meta.days_active === 'number' ? meta.days_active : 0,
      streak_days: typeof meta.streak_days === 'number' ? meta.streak_days : 0,
      is_premium: meta.is_premium === true,
    },
  };
}
