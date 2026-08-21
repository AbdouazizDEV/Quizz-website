import { useCallback, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AUTH_FORM_PLACEHOLDERS } from '@constants/authFormPlaceholders';
import { Routes } from '@constants/Routes';
import { persistPasskeyAuthResult, signOutAndSyncStore } from '@services/auth/authSessionController';
import { mapLoginUserToAuthMe } from '@services/auth/mapLoginToAuthMe';
import { getAuthMeFromStore } from '@services/auth/authMeRepository';
import { loginGateway } from '@services/auth/loginGatewayInstance';
import { toFrenchPasskeyError } from '@services/auth/passkeyAuthService';
import { Icon } from '@components/ui/Icon';

export function LoginPage() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [discoverableSubmitting, setDiscoverableSubmitting] = useState(false);
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

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting || discoverableSubmitting) return;
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
    if (submitting || discoverableSubmitting) return;
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
    <div className="auth-page">
      <div className="auth-inner">
        <Link to={Routes.WALKTHROUGH} aria-label="Retour" style={{ display: 'inline-flex', marginBottom: 24 }}>
          <Icon name="chevron-left" size={24} />
        </Link>
        <h1 style={{ fontSize: 34, margin: '0 0 8px' }}>Bon retour !</h1>
        <p className="muted">Connecte-toi avec ta passkey — sans mot de passe.</p>
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 28, marginTop: 36 }}>
          <label className="field">
            <span>E-mail ou nom d’utilisateur</span>
            <input
              autoComplete="username webauthn"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={AUTH_FORM_PLACEHOLDERS.email}
            />
          </label>
          {formError ? <p className="error-text">{formError}</p> : null}
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Connexion…' : 'Continuer avec une passkey'}
          </button>
          <button type="button" className="btn btn-outline" onClick={() => void onDiscoverable()} disabled={discoverableSubmitting}>
            {discoverableSubmitting ? 'Passkey…' : 'Utiliser une passkey enregistrée'}
          </button>
        </form>
        <p className="muted" style={{ marginTop: 28, textAlign: 'center' }}>
          Pas encore de compte ? <Link to={Routes.CREATE_ACCOUNT_TYPE} style={{ color: '#E8431A', fontWeight: 800 }}>S’inscrire</Link>
        </p>
      </div>
    </div>
  );
}
