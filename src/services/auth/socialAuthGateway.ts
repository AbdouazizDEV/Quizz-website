import { loginWithGoogleIdToken } from '@services/auth/googleAuthService';
import { isGoogleSignInConfigured } from '@config';

export type SocialAuthProvider = 'google' | 'facebook';

export function getOAuthRedirectUri(): string {
  if (typeof window === 'undefined') return 'http://localhost:5173/auth/callback';
  return `${window.location.origin}/auth/callback`;
}

/** Google natif via id_token ; Facebook encore indisponible. */
export async function signInWithSocialProvider(provider: SocialAuthProvider) {
  if (provider === 'google') {
    if (!isGoogleSignInConfigured()) {
      throw new Error('Connexion Google indisponible. Configurez VITE_GOOGLE_CLIENT_ID.');
    }
    throw new Error('Utilisez le bouton Google sur la page de connexion.');
  }
  throw new Error('Connexion Facebook indisponible.');
}

export { loginWithGoogleIdToken };
