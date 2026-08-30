import { useCallback, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthShell } from '@components/ui/auth/AuthShell';
import { UnderlineLabeledField } from '@components/ui/auth/UnderlineLabeledField';
import { Icon } from '@components/ui/Icon';
import { WalkthroughActionButton } from '@components/ui/walkthrough/WalkthroughActionButton';
import { AUTH_FORM_PLACEHOLDERS } from '@constants/authFormPlaceholders';
import { Routes } from '@constants/Routes';
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
      subline="Connectez-vous avec votre e-mail ou pseudo et votre mot de passe."
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
          Connectez-vous avec votre e-mail ou pseudo et mot de passe.
        </p>
      </div>
      <form className="auth-form auth-form--login" onSubmit={(e) => void onSubmit(e)}>
        {formError ? <p className="auth-error">{formError}</p> : null}
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
