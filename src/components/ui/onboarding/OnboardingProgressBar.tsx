interface OnboardingProgressBarProps {
  progress: number;
}

export function OnboardingProgressBar({ progress }: OnboardingProgressBarProps) {
  const clamped = Math.max(0, Math.min(1, progress));
  return (
    <div className="auth-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(clamped * 100)}>
      <div className="auth-progress-fill" style={{ width: `${clamped * 100}%` }} />
    </div>
  );
}
