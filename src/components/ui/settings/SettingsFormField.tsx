interface SettingsFormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
  inputMode?: 'text' | 'email' | 'tel' | 'numeric';
  autoComplete?: string;
  autoCapitalize?: 'off' | 'on' | 'words' | 'characters';
  multiline?: boolean;
}

export function SettingsFormField({
  label,
  value,
  onChange,
  placeholder,
  disabled,
  type = 'text',
  inputMode,
  autoComplete,
  autoCapitalize,
  multiline,
}: SettingsFormFieldProps) {
  return (
    <label className="settings-field">
      <span>{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          rows={3}
          autoComplete={autoComplete}
          autoCapitalize={autoCapitalize}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          inputMode={inputMode}
          autoComplete={autoComplete}
          autoCapitalize={autoCapitalize}
        />
      )}
    </label>
  );
}
