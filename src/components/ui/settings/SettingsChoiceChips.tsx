interface SettingsChoiceOption {
  value: string;
  label: string;
}

interface SettingsChoiceChipsProps {
  label: string;
  options: readonly SettingsChoiceOption[];
  value: string;
  onChange: (value: string) => void;
}

export function SettingsChoiceChips({ label, options, value, onChange }: SettingsChoiceChipsProps) {
  return (
    <div className="settings-choice">
      <p className="settings-hint">{label}</p>
      <div className="settings-chips" role="group" aria-label={label}>
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={value === opt.value ? 'settings-chip is-on' : 'settings-chip'}
            aria-pressed={value === opt.value}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
