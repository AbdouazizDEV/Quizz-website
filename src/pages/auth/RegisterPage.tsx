import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AUTH_FORM_PLACEHOLDERS } from '@constants/authFormPlaceholders';
import { Routes } from '@constants/Routes';
import { persistPasskeyAuthResult } from '@services/auth/authSessionController';
import { mapLoginUserToAuthMe } from '@services/auth/mapLoginToAuthMe';
import { registerWithPasskey, toFrenchPasskeyError } from '@services/auth/passkeyAuthService';
import { useOnboardingRegisterStore } from '@stores/onboardingRegisterStore';
import { Icon } from '@components/ui/Icon';

export function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!showSuccess) return;
    const t = window.setTimeout(() => navigate(Routes.HOME, { replace: true }), 1800);
    return () => window.clearTimeout(t);
  }, [navigate, showSuccess]);

  const handleSignup = async () => {
    if (submitting) return;
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    if (!trimmedUsername || !trimmedEmail) {
      setFormError('Renseignez le nom d’utilisateur et l’e-mail.');
      return;
    }
    const onboarding = useOnboardingRegisterStore.getState();
    setSubmitting(true);
    setFormError(null);
    try {
      const { user, session } = await registerWithPasskey({
        email: trimmedEmail,
        username: trimmedUsername,
        account_type: onboarding.accountTypeId || undefined,
        workplace: onboarding.workplaceId || undefined,
        full_name: onboarding.fullName.trim() || undefined,
        birth_date: onboarding.birthDateIso || undefined,
        country_code: onboarding.countryCca2 || undefined,
        phone: onboarding.phoneE164.trim() || undefined,
      });
      await persistPasskeyAuthResult(session, mapLoginUserToAuthMe(user));
      onboarding.clear();
      setShowSuccess(true);
    } catch (error) {
      setFormError(toFrenchPasskeyError(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-inner">
        <Link to={Routes.CREATE_ACCOUNT_PROFILE} aria-label="Retour">
          <Icon name="chevron-left" size={24} />
        </Link>
        <div style={{ height: 8, background: '#F0F0F0', borderRadius: 99, margin: '20px 0' }}>
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg,#E8431A,#F5A623)', borderRadius: 99 }} />
        </div>
        <h1 style={{ fontSize: 30 }}>Crée ton compte</h1>
        <p className="muted">Une passkey remplace le mot de passe. Ton appareil te demandera Face ID, empreinte ou clé.</p>
        <div style={{ display: 'grid', gap: 28, marginTop: 28 }}>
          <label className="field">
            <span>Nom d’utilisateur</span>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder={AUTH_FORM_PLACEHOLDERS.username} autoComplete="username" />
          </label>
          <label className="field">
            <span>E-mail</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={AUTH_FORM_PLACEHOLDERS.email} autoComplete="email" />
          </label>
          {formError ? <p className="error-text">{formError}</p> : null}
        </div>
        <button type="button" className="btn btn-primary" style={{ width: '100%', marginTop: 36 }} onClick={() => void handleSignup()} disabled={submitting}>
          {submitting ? 'Création de la passkey…' : 'Créer mon compte'}
        </button>
      </div>
      {showSuccess ? (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ textAlign: 'center' }}>
            <Icon name="circle-check" size={48} color="#2ECC71" />
            <h2>Compte créé !</h2>
            <p className="muted">Redirection vers l’accueil…</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
