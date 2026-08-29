import { WalkthroughActionButton } from './WalkthroughActionButton';

interface WalkthroughBottomBarProps {
  onPressStart?: () => void;
  onPressSignin?: () => void;
}

export function WalkthroughBottomBar({ onPressStart, onPressSignin }: WalkthroughBottomBarProps) {
  return (
    <footer className="auth-footer auth-footer--tall">
      <div className="auth-footer-inner">
        <WalkthroughActionButton label="COMMENCER" variant="primary" onClick={onPressStart} />
        <WalkthroughActionButton label="J'AI DÉJÀ UN COMPTE" variant="secondary" onClick={onPressSignin} />
      </div>
    </footer>
  );
}
