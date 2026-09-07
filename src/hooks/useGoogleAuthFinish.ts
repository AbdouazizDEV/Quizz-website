import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Routes } from '@constants/Routes';
import { persistPasskeyAuthResult, signOutAndSyncStore } from '@services/auth/authSessionController';
import { getAuthMeFromStore } from '@services/auth/authMeRepository';
import { loginWithGoogleIdToken, toFrenchGoogleAuthError } from '@services/auth/googleAuthService';
import { mapLoginUserToAuthMe } from '@services/auth/mapLoginToAuthMe';

export function useGoogleAuthFinish() {
  const navigate = useNavigate();
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  const finishGoogleSignIn = useCallback(
    async (idToken: string) => {
      if (googleSubmitting) return;
      setGoogleError(null);
      setGoogleSubmitting(true);
      try {
        const { user, session } = await loginWithGoogleIdToken(idToken);
        await persistPasskeyAuthResult(session, mapLoginUserToAuthMe(user));
        if (!getAuthMeFromStore()) {
          await signOutAndSyncStore();
          throw new Error('Profil introuvable après connexion Google.');
        }
        navigate(Routes.HOME, { replace: true });
      } catch (error) {
        setGoogleError(toFrenchGoogleAuthError(error));
      } finally {
        setGoogleSubmitting(false);
      }
    },
    [googleSubmitting, navigate],
  );

  return {
    finishGoogleSignIn,
    googleSubmitting,
    googleError,
    setGoogleError,
  };
}
