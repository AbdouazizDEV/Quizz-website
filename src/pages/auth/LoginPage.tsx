import { useCallback, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { toFrenchPasskeyError } from '@services/auth/passkeyAuthService';

export function LoginPage() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [discoverableSubmitting, setDiscoverableSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const busy = submitting || discoverableSubmitting;

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
    if (busy) return;
    const trimmed = identifier.trim();
    if (!trimmed) {
      setFormError('Saisissez votre e-mail ou nom d’utilisateur.');
      return;
    }
    setFormError(null);
    setSubmitting(true);
    try {
      await finishLogin(await loginGateway.signIn({ identifier: trimmed }));
    } catch (error) {
      setFormError(toFrenchPasskeyError(error));
    } finally {
      setSubmitting(false);
    }
  };

  const onDiscoverable = async () => {
    if (busy) return;
    setFormError(null);
    setDiscoverableSubmitting(true);
    try {
      await finishLogin(await loginGateway.signInDiscoverable());
    } catch (error) {
      setFormError(toFrenchPasskeyError(error));
    } finally {
      setDiscoverableSubmitting(false);
    }
  };

  return (
    <AuthShell
      variant="login"
      artSrc="/assets/icons/image2.png"
      headline="Bon retour parmi nous"
      subline="Connecte-toi avec Face ID, empreinte ou une passkey déjà enregistrée."
      footer={
        <footer className="auth-footer auth-footer--continue auth-footer--login">
          <div className="auth-footer-inner">
            {busy ? (
              <div className="auth-loader-row">
                <div className="auth-loader" aria-hidden />
              </div>
            ) : null}
            <WalkthroughActionButton
              label="SE CONNECTER AVEC PASSKEY"
              variant="primary"
              onClick={() => void onSubmit()}
              disabled={busy}
            />
          </div>
        </footer>
      }
    >
      <button
        type="button"
        className="auth-back"
        aria-label="Retour"
        onClick={() => navigate(Routes.CREATE_ACCOUNT_TYPE, { replace: true })}
      >
        <Icon name="arrow-left" size={22} color="#212121" />
      </button>
      <div className="auth-text-block auth-text-block--login">
        <h1 className="auth-title login-title">Bonjour 👋</h1>
        <p className="auth-subtitle auth-subtitle--login">
          Connectez-vous avec Face ID ou empreinte digitale.
        </p>
      </div>
      <form className="auth-form auth-form--login" onSubmit={(e) => void onSubmit(e)}>
        {formError ? <p className="auth-error">{formError}</p> : null}
        <UnderlineLabeledField
          label="E-mail ou pseudo"
          value={identifier}
          onChangeText={setIdentifier}
          placeholder={AUTH_FORM_PLACEHOLDERS.email}
          autoComplete="username webauthn"
        />
        <button
          type="button"
          className="auth-discoverable"
          onClick={() => void onDiscoverable()}
          disabled={busy}
        >
          Utiliser un passkey enregistré sur cet appareil
        </button>
      </form>
    </AuthShell>
  );
}
