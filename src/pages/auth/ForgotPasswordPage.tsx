import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthShell } from '@components/ui/auth/AuthShell';
import { UnderlineLabeledField } from '@components/ui/auth/UnderlineLabeledField';
import { Icon } from '@components/ui/Icon';
import { WalkthroughActionButton } from '@components/ui/walkthrough/WalkthroughActionButton';
import { AUTH_FORM_PLACEHOLDERS } from '@constants/authFormPlaceholders';
import { Routes } from '@constants/Routes';
import { useResetPasswordForm } from '@hooks/auth/useResetPasswordForm';
import { passwordResetGateway } from '@services/passwordReset/passwordResetGatewayInstance';

const EMAIL_STORAGE_KEY = 'quizz.forgotPassword.email';
const OTP_LENGTH = 4;

type ForgotStep = 'email' | 'otp' | 'new-password';

function stepFromPath(pathname: string): ForgotStep {
  if (pathname.includes('/otp')) return 'otp';
  if (pathname.includes('/new-password')) return 'new-password';
  return 'email';
}

function readStoredEmail(locationState: unknown): string {
  const fromState =
    typeof locationState === 'object' &&
    locationState !== null &&
    'email' in locationState &&
    typeof (locationState as { email?: unknown }).email === 'string'
      ? (locationState as { email: string }).email.trim().toLowerCase()
      : '';
  if (fromState) return fromState;
  try {
    return (sessionStorage.getItem(EMAIL_STORAGE_KEY) ?? '').trim().toLowerCase();
  } catch {
    return '';
  }
}

function persistEmail(email: string) {
  try {
    sessionStorage.setItem(EMAIL_STORAGE_KEY, email);
  } catch {
    /* ignore */
  }
}

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const step = stepFromPath(location.pathname);

  const [email, setEmail] = useState(() => readStoredEmail(location.state));
  const [otpDigits, setOtpDigits] = useState<string[]>(() => Array(OTP_LENGTH).fill(''));
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const {
    form,
    setNewPassword,
    setConfirmPassword,
    validateForm,
    setSubmitError,
    submitError,
  } = useResetPasswordForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (step === 'email') return;
    const stored = readStoredEmail(location.state);
    if (!stored) {
      navigate(Routes.FORGOT_PASSWORD, { replace: true });
      return;
    }
    setEmail(stored);
  }, [location.state, navigate, step]);

  const otpCode = useMemo(() => otpDigits.join(''), [otpDigits]);

  const headline =
    step === 'email'
      ? 'Mot de passe oublié'
      : step === 'otp'
        ? 'Vérifiez votre e-mail'
        : 'Nouveau mot de passe';

  const subline =
    step === 'email'
      ? 'Recevez un code pour réinitialiser votre mot de passe.'
      : step === 'otp'
        ? 'Saisissez le code à 4 chiffres reçu par e-mail.'
        : 'Choisissez un nouveau mot de passe sécurisé.';

  const onRequestOtp = async (event?: FormEvent) => {
    event?.preventDefault();
    if (submitting) return;
    const normalized = email.trim().toLowerCase();
    if (!normalized) {
      setFormError('Saisissez votre adresse e-mail.');
      return;
    }
    setFormError(null);
    setInfoMessage(null);
    setSubmitting(true);
    try {
      await passwordResetGateway.requestOtp(normalized);
      persistEmail(normalized);
      setEmail(normalized);
      navigate(Routes.FORGOT_PASSWORD_OTP, { state: { email: normalized } });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Impossible d’envoyer le code OTP.');
    } finally {
      setSubmitting(false);
    }
  };

  const onVerifyOtp = async (event?: FormEvent) => {
    event?.preventDefault();
    if (submitting) return;
    if (!/^\d{4}$/.test(otpCode)) {
      setFormError('Le code OTP doit contenir 4 chiffres.');
      return;
    }
    setFormError(null);
    setSubmitting(true);
    try {
      await passwordResetGateway.verifyOtp(email, otpCode);
      navigate(Routes.FORGOT_PASSWORD_NEW, { state: { email } });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Code OTP invalide ou expiré.');
    } finally {
      setSubmitting(false);
    }
  };

  const onResetPassword = async (event?: FormEvent) => {
    event?.preventDefault();
    if (submitting || done) return;
    setFormError(null);
    setSubmitError(null);
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      await passwordResetGateway.completePendingReset(form.newPassword, form.confirmPassword);
      try {
        sessionStorage.removeItem(EMAIL_STORAGE_KEY);
      } catch {
        /* ignore */
      }
      setDone(true);
      setInfoMessage('Mot de passe mis à jour. Vous pouvez vous connecter.');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Impossible de réinitialiser le mot de passe.';
      setFormError(message);
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateOtpDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    setOtpDigits((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const onOtpKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const footerLabel =
    step === 'email'
      ? submitting
        ? 'Envoi…'
        : 'ENVOYER LE CODE'
      : step === 'otp'
        ? submitting
          ? 'Vérification…'
          : 'VÉRIFIER'
        : done
          ? 'SE CONNECTER'
          : submitting
            ? 'Enregistrement…'
            : 'ENREGISTRER';

  const onFooterPress = () => {
    if (done) {
      navigate(Routes.LOGIN, { replace: true });
      return;
    }
    if (step === 'email') void onRequestOtp();
    else if (step === 'otp') void onVerifyOtp();
    else void onResetPassword();
  };

  return (
    <AuthShell
      variant="login"
      artSrc="/assets/icons/image3.png"
      headline={headline}
      subline={subline}
      footer={
        <footer className="auth-footer auth-footer--continue auth-footer--login">
          <div className="auth-footer-inner">
            {submitting ? (
              <div className="auth-loader-row">
                <div className="auth-loader" aria-hidden />
              </div>
            ) : null}
            <WalkthroughActionButton
              label={footerLabel}
              variant="primary"
              onClick={onFooterPress}
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
        onClick={() => {
          if (step === 'otp') navigate(Routes.FORGOT_PASSWORD);
          else if (step === 'new-password') navigate(Routes.FORGOT_PASSWORD_OTP, { state: { email } });
          else navigate(Routes.LOGIN);
        }}
      >
        <Icon name="arrow-left" size={22} color="#212121" />
      </button>

      <div className="auth-text-block auth-text-block--login">
        <h1 className="auth-title login-title">
          {step === 'email'
            ? 'Mot de passe oublié 🔑'
            : step === 'otp'
              ? 'Code OTP ✉️'
              : 'Nouveau mot de passe 🔒'}
        </h1>
        <p className="auth-subtitle auth-subtitle--login">
          {step === 'email'
            ? 'Indiquez l’e-mail associé à votre compte Quizz+.'
            : step === 'otp'
              ? `Un code a été envoyé à ${email || 'votre e-mail'}.`
              : 'Minimum 8 caractères, différent de l’ancien.'}
        </p>
      </div>

      {step === 'email' ? (
        <form className="auth-form auth-form--login" onSubmit={(e) => void onRequestOtp(e)}>
          {formError ? <p className="auth-error">{formError}</p> : null}
          <UnderlineLabeledField
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholder={AUTH_FORM_PLACEHOLDERS.email}
            type="email"
            autoComplete="email"
          />
          <div className="auth-links">
            <Link to={Routes.LOGIN} className="auth-text-link">
              Retour à la connexion
            </Link>
          </div>
        </form>
      ) : null}

      {step === 'otp' ? (
        <form className="auth-form auth-form--login" onSubmit={(e) => void onVerifyOtp(e)}>
          {formError ? <p className="auth-error">{formError}</p> : null}
          <div className="auth-otp-row" role="group" aria-label="Code OTP à 4 chiffres">
            {otpDigits.map((digit, index) => (
              <input
                key={`otp-${index}`}
                ref={(el) => {
                  otpRefs.current[index] = el;
                }}
                className="auth-otp-box"
                inputMode="numeric"
                autoComplete={index === 0 ? 'one-time-code' : 'off'}
                maxLength={1}
                value={digit}
                onChange={(e) => updateOtpDigit(index, e.target.value)}
                onKeyDown={(e) => onOtpKeyDown(index, e)}
                aria-label={`Chiffre ${index + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            className="auth-text-link auth-text-link--button"
            disabled={submitting}
            onClick={() => void onRequestOtp()}
          >
            Renvoyer le code
          </button>
        </form>
      ) : null}

      {step === 'new-password' ? (
        <form className="auth-form auth-form--login" onSubmit={(e) => void onResetPassword(e)}>
          {formError || submitError ? <p className="auth-error">{formError ?? submitError}</p> : null}
          {infoMessage ? <p className="auth-info">{infoMessage}</p> : null}
          {!done ? (
            <>
              <UnderlineLabeledField
                label="Nouveau mot de passe"
                value={form.newPassword}
                onChangeText={setNewPassword}
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                errorText={form.newPasswordError}
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
                value={form.confirmPassword}
                onChangeText={setConfirmPassword}
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                errorText={form.confirmPasswordError}
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
            </>
          ) : (
            <div className="auth-links">
              <Link to={Routes.LOGIN} className="auth-text-link">
                Aller à la connexion
              </Link>
            </div>
          )}
        </form>
      ) : null}
    </AuthShell>
  );
}
