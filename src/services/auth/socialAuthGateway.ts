export type SocialAuthProvider = 'google' | 'facebook';

export function getOAuthRedirectUri(): string {
  if (typeof window === 'undefined') return 'http://localhost:5173/auth/callback';
  return `${window.location.origin}/auth/callback`;
}

/** OAuth legacy désactivé : le flux principal est passkey. */
export async function signInWithSocialProvider(_provider: SocialAuthProvider): Promise<never> {
  throw new Error('Connexion sociale indisponible. Utilisez une passkey.');
}
