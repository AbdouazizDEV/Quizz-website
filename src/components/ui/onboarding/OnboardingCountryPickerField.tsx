import { AUTH_COUNTRIES, type AuthCountry } from '@constants/authCountries';
import { Icon } from '@components/ui/Icon';

interface OnboardingCountryPickerFieldProps {
  label: string;
  country: AuthCountry;
  onChangeCountry: (country: AuthCountry) => void;
}

export function OnboardingCountryPickerField({
  label,
  country,
  onChangeCountry,
}: OnboardingCountryPickerFieldProps) {
  return (
    <label className="auth-field">
      <span className="auth-field-label">{label}</span>
      <span className="auth-field-row">
        <select
          className="auth-country-select"
          value={country.cca2}
          aria-label={label}
          onChange={(e) => {
            const next = AUTH_COUNTRIES.find((c) => c.cca2 === e.target.value);
            if (next) onChangeCountry(next);
          }}
        >
          {AUTH_COUNTRIES.map((item) => (
            <option key={item.cca2} value={item.cca2}>
              {item.flag} {item.name}
            </option>
          ))}
        </select>
        <Icon name="chevron-down" size={20} color="#FFD700" />
      </span>
      <span className="auth-underline" />
    </label>
  );
}
