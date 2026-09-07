import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthShell } from '@components/ui/auth/AuthShell';
import { AuthSocialDivider } from '@components/ui/auth/AuthSocialDivider';
import { GoogleSignInButton } from '@components/ui/auth/GoogleSignInButton';
import { UnderlineLabeledField } from '@components/ui/auth/UnderlineLabeledField';
import { Icon } from '@components/ui/Icon';
import { WalkthroughActionButton } from '@components/ui/walkthrough/WalkthroughActionButton';
import { AUTH_FORM_PLACEHOLDERS } from '@constants/authFormPlaceholders';
import {
  GOOGLE_AUTH_ERROR_CODES,
  GOOGLE_AUTH_MESSAGES,
} from '@constants/auth.messages';
import { Routes } from '@constants/Routes';
import { isGoogleSignInConfigured } from '@config';
import { persistPasskeyAuthResult, signOutAndSyncStore } from '@services/auth/authSessionController';
import { getAuthMeFromStore } from '@services/auth/authMeRepository';
import { mapLoginUserToAuthMe } from '@services/auth/mapLoginToAuthMe';
import { loginGateway } from '@services/auth/loginGatewayInstance';
import { toFrenchPasswordAuthError } from '@services/auth/passwordAuthService';

export function LoginPage() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const showGoogle = isGoogleSignInConfigured();
  const googleError = searchParams.get('google_error');
  const googleErrorCode = searchParams.get('google_error_code');

  useEffect(() => {
    if (!googleError?.trim()) return;
    const isNotRegistered =
      googleErrorCode === GOOGLE_AUTH_ERROR_CODES.accountNotRegistered;
    setShowRegisterPrompt(isNotRegistered);
    setFormError(
      isNotRegistered
        ? GOOGLE_AUTH_MESSAGES.accountNotRegistered
        : decodeURIComponent(googleError.replace(/\+/g, ' ')),
    );
    setSearchParams({}, { replace: true });
  }, [googleError, googleErrorCode, setSearchParams]);

  const finishLogin = useCallback(
    async (result: Awaited<ReturnType<typeof loginGateway.signIn>>) => {
      if (!result.session) throw new Error('Session absente.');
      await persistPasskeyAuthResult(
        result.session,
        result.user ? mapLoginUserToAuthMe(result.user) : null,
      );
      if (!getAuthMeFromStore()) {
        await signOutAndSyncStore();
        throw new Error('Profil introuvable après connexion.');
      }
      navigate(Routes.HOME, { replace: true });
    },
    [navigate],
  );

  const onSubmit = async (event?: FormEvent) => {
    event?.preventDefault();
    if (submitting) return;
    const trimmed = identifier.trim();
    if (!trimmed) {
      setFormError('Saisissez votre e-mail ou nom d’utilisateur.');
      return;
    }
    if (!password) {
      setFormError('Saisissez votre mot de passe.');
      return;
    }
    setFormError(null);
    setSubmitting(true);
    try {
      await finishLogin(await loginGateway.signIn({ identifier: trimmed, password }));
    } catch (error) {
      setFormError(toFrenchPasswordAuthError(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      variant="login"
      artSrc="/assets/icons/image2.png"
      headline="Bon retour parmi nous"
      subline={
        showGoogle
          ? 'Connectez-vous avec Google ou avec votre e-mail / pseudo et mot de passe.'
          : 'Connectez-vous avec votre e-mail ou pseudo et votre mot de passe.'
      }
      footer={
        <footer className="auth-footer auth-footer--continue auth-footer--login">
          <div className="auth-footer-inner">
            {submitting ? (
              <div className="auth-loader-row">
                <div className="auth-loader" aria-hidden />
              </div>
            ) : null}
            <WalkthroughActionButton
              label="SE CONNECTER"
              variant="primary"
              onClick={() => void onSubmit()}
              disabled={submitting}
            />
          </div>
        </footer>
      }
    >
      <button
        type="button"
        className="auth-back"
        aria-label="Retour"
        onClick={() => navigate(Routes.LANDING, { replace: true })}
      >
        <Icon name="arrow-left" size={22} color="#212121" />
      </button>
      <div className="auth-text-block auth-text-block--login">
        <h1 className="auth-title login-title">Bonjour 👋</h1>
        <p className="auth-subtitle auth-subtitle--login">
          {showGoogle
            ? 'Google, e-mail / pseudo et mot de passe.'
            : 'Connectez-vous avec votre e-mail ou pseudo et mot de passe.'}
        </p>
      </div>
      <form className="auth-form auth-form--login" onSubmit={(e) => void onSubmit(e)}>
        {formError ? (
          <div className="auth-error-block">
            <p className="auth-error">{formError}</p>
            {showRegisterPrompt ? (
              <Link to={Routes.CREATE_ACCOUNT_TYPE} className="auth-text-link auth-error-register-link">
                Créer un compte
              </Link>
            ) : null}
          </div>
        ) : null}
        {showGoogle ? (
          <>
            <GoogleSignInButton disabled={submitting} onError={setFormError} />
            <AuthSocialDivider />
          </>
        ) : null}
        <UnderlineLabeledField
          label="E-mail ou pseudo"
          value={identifier}
          onChangeText={setIdentifier}
          placeholder={AUTH_FORM_PLACEHOLDERS.email}
          autoComplete="username"
        />
        <UnderlineLabeledField
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          rightSlot={
            <button
              type="button"
              className="auth-password-toggle"
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              onClick={() => setShowPassword((v) => !v)}
            >
              <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color="#9E9E9E" />
            </button>
          }
        />
        <div className="auth-links">
          <Link to={Routes.FORGOT_PASSWORD} className="auth-text-link">
            Mot de passe oublié ?
          </Link>
          <Link to={Routes.CREATE_ACCOUNT_TYPE} className="auth-text-link">
            Créer un compte
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
