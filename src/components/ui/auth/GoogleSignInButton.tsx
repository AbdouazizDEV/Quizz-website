import { AppConfig } from '@config';
import { isGoogleSignInConfigured } from '@config';

type Props = {
  disabled?: boolean;
  onError?: (message: string) => void;
};

function googleRedirectUrl(): string {
  const returnTo =
    typeof window !== 'undefined'
      ? `${window.location.origin}/auth/callback`
      : 'https://quizzp.com/auth/callback';
  const params = new URLSearchParams({ return_to: returnTo });
  return `${AppConfig.API_BASE_URL}/auth/google/redirect?${params.toString()}`;
}

export function GoogleSignInButton({ disabled, onError }: Props) {
  if (!isGoogleSignInConfigured()) return null;

  return (
    <button
      type="button"
      className="auth-google-native-btn"
      disabled={disabled}
      onClick={() => {
        try {
          window.location.assign(googleRedirectUrl());
        } catch {
          onError?.('Impossible de lancer la connexion Google.');
        }
      }}
    >
      <span className="auth-google-native-btn__icon" aria-hidden>
        G
      </span>
      Continuer avec Google
    </button>
  );
}
