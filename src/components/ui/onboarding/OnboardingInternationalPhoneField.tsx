import { AUTH_COUNTRIES, type AuthCountry } from '@constants/authCountries';
import { AUTH_FORM_PLACEHOLDERS } from '@constants/authFormPlaceholders';

interface OnboardingInternationalPhoneFieldProps {
  label: string;
  country: AuthCountry;
  onChangeCountry: (country: AuthCountry) => void;
  onChangePhoneNumber: (phone: string) => void;
  nationalNumber: string;
  placeholder?: string;
}

export function OnboardingInternationalPhoneField({
  label,
  country,
  onChangeCountry,
  onChangePhoneNumber,
  nationalNumber,
  placeholder = AUTH_FORM_PLACEHOLDERS.phone,
}: OnboardingInternationalPhoneFieldProps) {
  return (
    <label className="auth-field">
      <span className="auth-field-label">{label}</span>
      <span className="auth-field-row">
        <select
          className="auth-phone-select"
          value={country.cca2}
          aria-label="Indicatif pays"
          onChange={(e) => {
            const next = AUTH_COUNTRIES.find((c) => c.cca2 === e.target.value);
            if (next) onChangeCountry(next);
          }}
        >
          {AUTH_COUNTRIES.map((item) => (
            <option key={item.cca2} value={item.cca2}>
              {item.flag} {item.cca2}
            </option>
          ))}
        </select>
        <span className="auth-phone-dial">+{country.dial}</span>
        <input
          className="auth-field-input"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          value={nationalNumber}
          placeholder={placeholder}
          onChange={(e) => onChangePhoneNumber(e.target.value)}
        />
      </span>
      <span className="auth-underline" />
    </label>
  );
}
