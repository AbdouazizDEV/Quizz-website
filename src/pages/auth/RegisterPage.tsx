import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthShell } from '@components/ui/auth/AuthShell';
import { AuthSocialDivider } from '@components/ui/auth/AuthSocialDivider';
import { GoogleSignInButton } from '@components/ui/auth/GoogleSignInButton';
import { PasswordSuccessModal } from '@components/ui/auth/PasswordSuccessModal';
import { UnderlineLabeledField } from '@components/ui/auth/UnderlineLabeledField';
import { Icon } from '@components/ui/Icon';
import { OnboardingContinueBar } from '@components/ui/onboarding/OnboardingContinueBar';
import { OnboardingNavbar } from '@components/ui/onboarding/OnboardingNavbar';
import { AUTH_FORM_PLACEHOLDERS } from '@constants/authFormPlaceholders';
import { Routes } from '@constants/Routes';
import { isGoogleSignInConfigured } from '@config';
import { persistPasskeyAuthResult } from '@services/auth/authSessionController';
import { mapLoginUserToAuthMe } from '@services/auth/mapLoginToAuthMe';
import { registerWithPassword, toFrenchPasswordAuthError } from '@services/auth/passwordAuthService';
import { useOnboardingRegisterStore } from '@stores/onboardingRegisterStore';

const SUCCESS_MODAL_MS = 5_000;
const MIN_PASSWORD_LENGTH = 6;

function formatRegisterApiError(raw: unknown): string {
  return toFrenchPasswordAuthError(raw) || 'Impossible de finaliser l’inscription. Réessayez.';
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const showGoogle = isGoogleSignInConfigured();

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
    if (password.length < MIN_PASSWORD_LENGTH) {
      setFormError(`Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`);
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Les mots de passe ne correspondent pas.');
      return;
    }

    const onboarding = useOnboardingRegisterStore.getState();
    setSubmitting(true);
    try {
      const { user, session } = await registerWithPassword({
        email: trimmedEmail,
        username: trimmedUsername,
        password,
        account_type: onboarding.accountTypeId || undefined,
        workplace: onboarding.workplaceId || undefined,
        full_name: onboarding.fullName.trim() || undefined,
        birth_date: onboarding.birthDateIso || undefined,
        country_code: onboarding.countryCca2 || undefined,
        phone: onboarding.phoneE164.trim() || undefined,
        gender: onboarding.gender || undefined,
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
      subline="Créez votre compte en quelques secondes."
      footer={
        <OnboardingContinueBar
          label={submitting ? 'Inscription…' : 'CRÉER MON COMPTE'}
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
            {showGoogle
              ? 'Inscrivez-vous avec Google ou avec e-mail et mot de passe.'
              : 'Saisissez votre nom d&apos;utilisateur, e-mail et mot de passe.'}
          </p>
        </div>
        <div className="auth-form">
          {formError ? <p className="auth-error">{formError}</p> : null}
          {showGoogle ? (
            <>
              <GoogleSignInButton disabled={submitting} onError={setFormError} />
              <AuthSocialDivider />
            </>
          ) : null}
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
          <UnderlineLabeledField
            label="Mot de passe"
            value={password}
            onChangeText={setPassword}
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
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
          <UnderlineLabeledField
            label="Confirmer le mot de passe"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            type={showConfirm ? 'text' : 'password'}
            autoComplete="new-password"
            rightSlot={
              <button
                type="button"
                className="auth-password-toggle"
                aria-label={showConfirm ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                onClick={() => setShowConfirm((v) => !v)}
              >
                <Icon name={showConfirm ? 'eye-off' : 'eye'} size={20} color="#9E9E9E" />
              </button>
            }
          />
        </div>
      </div>
      {showSuccess ? <PasswordSuccessModal /> : null}
    </AuthShell>
  );
}
