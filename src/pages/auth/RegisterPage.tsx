import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthShell } from '@components/ui/auth/AuthShell';
import { PasswordSuccessModal } from '@components/ui/auth/PasswordSuccessModal';
import { UnderlineLabeledField } from '@components/ui/auth/UnderlineLabeledField';
import { OnboardingContinueBar } from '@components/ui/onboarding/OnboardingContinueBar';
import { OnboardingNavbar } from '@components/ui/onboarding/OnboardingNavbar';
import { AUTH_FORM_PLACEHOLDERS } from '@constants/authFormPlaceholders';
import { Routes } from '@constants/Routes';
import { persistPasskeyAuthResult } from '@services/auth/authSessionController';
import { mapLoginUserToAuthMe } from '@services/auth/mapLoginToAuthMe';
import { registerWithPasskey, toFrenchPasskeyError } from '@services/auth/passkeyAuthService';
import { useOnboardingRegisterStore } from '@stores/onboardingRegisterStore';

const SUCCESS_MODAL_MS = 5_000;

function formatRegisterApiError(raw: unknown): string {
  return toFrenchPasskeyError(raw) || 'Impossible de finaliser l’inscription. Réessayez.';
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!showSuccess) return undefined;
    const timeout = window.setTimeout(() => {
      setShowSuccess(false);
      navigate(Routes.HOME, { replace: true });
    }, SUCCESS_MODAL_MS);
    return () => window.clearTimeout(timeout);
  }, [navigate, showSuccess]);

  const handleSignup = async () => {
    if (submitting) return;
    setFormError(null);
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    if (!trimmedUsername || !trimmedEmail) {
      setFormError('Renseignez le nom d’utilisateur et l’e-mail.');
      return;
    }
    if (trimmedUsername.length > 50) {
      setFormError('Le nom d’utilisateur ne peut pas dépasser 50 caractères.');
      return;
    }

    const onboarding = useOnboardingRegisterStore.getState();
    setSubmitting(true);
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
      setFormError(formatRegisterApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      variant="login"
      artSrc="/assets/icons/image1.png"
      headline="Presque prêt à jouer"
      subline="Une passkey remplace le mot de passe. Plus simple, plus sûr."
      footer={
        <OnboardingContinueBar
          label={submitting ? 'Inscription…' : 'Inscrivez-vous avec Passkey'}
          onPress={() => void handleSignup()}
          disabled={submitting}
        />
      }
    >
      <OnboardingNavbar progress={1} onBack={() => navigate(Routes.CREATE_ACCOUNT_PROFILE)} />
      <div className="auth-scroll">
        <div className="auth-text-block">
          <h1 className="auth-title profile-title">Créer un compte ✏️</h1>
          <p className="auth-subtitle auth-subtitle--register">
            Veuillez saisir votre nom d&apos;utilisateur, votre adresse e-mail et votre mot de passe.
          </p>
        </div>
        <div className="auth-form">
          <UnderlineLabeledField
            label="Nom d'utilisateur"
            value={username}
            onChangeText={setUsername}
            placeholder={AUTH_FORM_PLACEHOLDERS.username}
            autoComplete="username"
            maxLength={50}
          />
          <UnderlineLabeledField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder={AUTH_FORM_PLACEHOLDERS.email}
            type="email"
            autoComplete="email"
          />
          <p className="auth-passkey-hint">
            Vous configurerez Face ID ou empreinte digitale à l’étape suivante.
          </p>
          {formError ? <p className="auth-error">{formError}</p> : null}
        </div>
      </div>
      {showSuccess ? <PasswordSuccessModal /> : null}
    </AuthShell>
  );
}
