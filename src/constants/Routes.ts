export const Routes = {
  SPLASH: '/',
  LANDING: '/accueil',
  WALKTHROUGH: '/walkthrough',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  FORGOT_PASSWORD_OTP: '/forgot-password/otp',
  FORGOT_PASSWORD_NEW: '/forgot-password/new-password',
  CREATE_ACCOUNT_TYPE: '/create-account-type',
  CREATE_ACCOUNT_WORKPLACE: '/create-account-workplace',
  CREATE_ACCOUNT_PROFILE: '/create-account-profile',
  REGISTER: '/register',
  AUTH_EMAIL_CALLBACK: '/auth/callback',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  HOME: '/home',
  DEFIS: '/defis',
  CATEGORIES: '/categories',
  SCOREBOARD: '/scoreboard',
  PLAYERS: '/players',
  PROFILE: '/profile',
  STATISTICS: '/statistics',
  NETWORK: '/network',
  GAINS: '/gains',
  GAINS_HOW: '/gains/comment-gagner',
  GAINS_PRIZES: '/gains/prix',
  GAINS_REWARDS: '/gains/recompenses',
  GAINS_MY: '/gains/mes-gains',
  FRIEND_SCAN: '/friend-scan',
  FRIEND_INVITE: '/friend',
  SETTINGS: '/settings',
  SETTINGS_PERSONAL: '/settings/personal-info',
  SETTINGS_NOTIFICATIONS: '/settings/notifications',
  SETTINGS_MUSIC: '/settings/music',
  SETTINGS_SECURITY: '/settings/security',
  SETTINGS_HELP: '/settings/help',
  SETTINGS_ABOUT: '/settings/about',
  PREMIUM: '/premium',
  PREMIUM_COMPARE: '/premium/compare',
  PREMIUM_PLANS: '/premium/plans',
  PREMIUM_PAYMENT: '/premium/payment',
  PREMIUM_SUCCESS: '/premium/success',
  ARENA: '/arena',
  CARNET: '/carnet',
} as const;

export function buildUserProfileHref(userId: string): string {
  return `/users/${encodeURIComponent(userId)}`;
}

export function buildQuizEntryHref(
  quizId: string,
  options?: {
    categorySlug?: string | null;
    duelId?: string | null;
    challengeId?: string | null;
    competitionId?: string | null;
    matchId?: string | null;
  },
): string {
  const id = encodeURIComponent(quizId);
  const params = new URLSearchParams();
  if (options?.categorySlug) params.set('categorySlug', options.categorySlug);
  if (options?.duelId) params.set('duelId', options.duelId);
  if (options?.challengeId) params.set('challengeId', options.challengeId);
  if (options?.competitionId) params.set('competitionId', options.competitionId);
  if (options?.matchId) params.set('matchId', options.matchId);
  const qs = params.toString();
  return qs ? `/quiz/${id}?${qs}` : `/quiz/${id}`;
}
