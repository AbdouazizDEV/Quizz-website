import type { ProfileGender } from '@app-types/profile.types';

export type OnboardingGender = Extract<ProfileGender, 'male' | 'female'>;

interface OnboardingGenderFieldProps {
  label: string;
  value: OnboardingGender | null;
  onChange: (gender: OnboardingGender) => void;
}

const OPTIONS: { id: OnboardingGender; label: string; emoji: string }[] = [
  { id: 'male', label: 'Homme', emoji: '👨' },
  { id: 'female', label: 'Femme', emoji: '👩' },
];

export function OnboardingGenderField({ label, value, onChange }: OnboardingGenderFieldProps) {
  return (
    <div className="auth-field auth-gender-field">
      <span className="auth-field-label">{label}</span>
      <div className="auth-gender-options" role="group" aria-label={label}>
        {OPTIONS.map((option) => {
          const selected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              className={`auth-gender-option${selected ? ' is-selected' : ''}`}
              aria-pressed={selected}
              onClick={() => onChange(option.id)}
            >
              <span className="auth-gender-emoji" aria-hidden>
                {option.emoji}
              </span>
              <span className="auth-gender-label">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
