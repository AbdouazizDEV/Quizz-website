import { WalkthroughActionButton } from '@components/ui/walkthrough/WalkthroughActionButton';

interface OnboardingSkipBarProps {
  label?: string;
  onSkip?: () => void;
}

export function OnboardingSkipBar({ label = 'Sauter', onSkip }: OnboardingSkipBarProps) {
  return (
    <footer className="auth-footer auth-footer--skip">
      <WalkthroughActionButton label={label} variant="secondary" onClick={onSkip} />
    </footer>
  );
}
