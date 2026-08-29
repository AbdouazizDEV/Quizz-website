import { AUTH_FORM_PLACEHOLDERS } from '@constants/authFormPlaceholders';
import { Icon } from '@components/ui/Icon';

interface OnboardingDateFieldProps {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
}

function formatFr(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${d}/${m}/${date.getFullYear()}`;
}

function toIsoInput(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function OnboardingDateField({
  label,
  value,
  onChange,
  placeholder = AUTH_FORM_PLACEHOLDERS.birthDate,
}: OnboardingDateFieldProps) {
  return (
    <label className="auth-field">
      <span className="auth-field-label">{label}</span>
      <span className="auth-date-wrap">
        <span className="auth-field-row">
          <input
            className="auth-field-input"
            value={value ? formatFr(value) : ''}
            placeholder={placeholder}
            readOnly
            tabIndex={-1}
          />
          <Icon name="calendar" size={20} color="#FFD700" />
        </span>
        <input
          type="date"
          className="auth-date-native"
          aria-label={label}
          value={value ? toIsoInput(value) : ''}
          max={toIsoInput(new Date())}
          onChange={(e) => {
            if (!e.target.value) {
              onChange(null);
              return;
            }
            const [y, m, d] = e.target.value.split('-').map(Number);
            onChange(new Date(y, m - 1, d));
          }}
        />
      </span>
      <span className="auth-underline" />
    </label>
  );
}
