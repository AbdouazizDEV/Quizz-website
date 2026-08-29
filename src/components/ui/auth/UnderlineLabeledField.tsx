import type { InputHTMLAttributes, ReactNode } from 'react';

interface UnderlineLabeledFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  rightSlot?: ReactNode;
  errorText?: string | null;
}

export function UnderlineLabeledField({
  label,
  value,
  onChangeText,
  placeholder,
  rightSlot,
  errorText,
  autoCapitalize = 'none',
  ...inputProps
}: UnderlineLabeledFieldProps) {
  return (
    <label className="auth-field">
      <span className="auth-field-label">{label}</span>
      <span className="auth-field-row">
        <input
          className="auth-field-input"
          value={value}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder={placeholder}
          autoCapitalize={autoCapitalize}
          aria-label={inputProps['aria-label'] ?? label}
          {...inputProps}
        />
        {rightSlot}
      </span>
      <span className="auth-underline" />
      {errorText ? <span className="auth-error">{errorText}</span> : null}
    </label>
  );
}
