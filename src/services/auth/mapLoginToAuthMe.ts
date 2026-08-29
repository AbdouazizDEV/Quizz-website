import type { AuthMeResponse } from '@sdk';
import type { components } from '@sdk';

type AuthUser = components['schemas']['AuthUser'];

function readFiniteNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

function readString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value : null;
}

/** Préremplit le cache `auth/me` depuis la réponse login (avant le GET /auth/me complet). */
export function mapLoginUserToAuthMe(user: AuthUser): AuthMeResponse {
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const extra = user as Record<string, unknown>;
  const profileFromUser =
    extra.profile && typeof extra.profile === 'object'
      ? (extra.profile as Record<string, unknown>)
      : null;
  const userId = user.id ?? '';

  const totalScore =
    readFiniteNumber(profileFromUser?.total_score) ??
    readFiniteNumber(meta.total_score) ??
    readFiniteNumber(extra.total_score);

  return {
    user,
    profile: {
      id: (readString(profileFromUser?.id) ?? userId) as string,
      username:
        readString(profileFromUser?.username) ||
        String(meta.username ?? '').trim() ||
        'Joueur',
      full_name:
        readString(profileFromUser?.full_name) ??
        (typeof meta.full_name === 'string' ? meta.full_name : null),
      avatar_url: readString(profileFromUser?.avatar_url) ?? readString(meta.avatar_url),
      level_code:
        readString(profileFromUser?.level_code) ||
        (typeof meta.level_code === 'string' ? meta.level_code : 'Z0'),
      total_score: totalScore ?? 0,
      quizzes_completed:
        readFiniteNumber(profileFromUser?.quizzes_completed) ??
        readFiniteNumber(meta.quizzes_completed) ??
        0,
      days_active:
        readFiniteNumber(profileFromUser?.days_active) ?? readFiniteNumber(meta.days_active) ?? 0,
      streak_days:
        readFiniteNumber(profileFromUser?.streak_days) ?? readFiniteNumber(meta.streak_days) ?? 0,
      is_premium:
        profileFromUser?.is_premium === true || meta.is_premium === true,
    },
  };
}
