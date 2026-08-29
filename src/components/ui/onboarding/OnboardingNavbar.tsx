import { Icon } from '@components/ui/Icon';
import { OnboardingProgressBar } from './OnboardingProgressBar';

interface OnboardingNavbarProps {
  progress: number;
  onBack: () => void;
}

export function OnboardingNavbar({ progress, onBack }: OnboardingNavbarProps) {
  return (
    <header className="auth-navbar">
      <button type="button" className="auth-back" onClick={onBack} aria-label="Retour">
        <Icon name="arrow-left" size={22} color="#212121" />
      </button>
      <OnboardingProgressBar progress={progress} />
      <span className="auth-nav-spacer" aria-hidden />
    </header>
  );
}
