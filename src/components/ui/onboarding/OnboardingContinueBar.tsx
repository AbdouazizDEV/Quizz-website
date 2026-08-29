import { WalkthroughActionButton } from '@components/ui/walkthrough/WalkthroughActionButton';

interface OnboardingContinueBarProps {
  label?: string;
  onPress?: () => void;
  disabled?: boolean;
}

export function OnboardingContinueBar({
  label = 'Continuer',
  onPress,
  disabled,
}: OnboardingContinueBarProps) {
  return (
    <footer className="auth-footer auth-footer--continue">
      <WalkthroughActionButton label={label} variant="primary" onClick={onPress} disabled={disabled} />
    </footer>
  );
}
