import type { InputHTMLAttributes, ReactNode } from 'react';
import { Icon } from '@components/ui/Icon';

interface OnboardingFilledFieldProps {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  editable?: boolean;
  rightIcon?: 'calendar' | 'chevron-down';
  onPressField?: () => void;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  trailing?: ReactNode;
}

export function OnboardingFilledField({
  label,
  value,
  onChangeText,
  placeholder,
  editable = true,
  rightIcon,
  onPressField,
  inputProps,
  trailing,
}: OnboardingFilledFieldProps) {
  return (
    <label className="auth-field">
      <span className="auth-field-label">{label}</span>
      <span className="auth-field-row">
        <input
          className="auth-field-input"
          value={value}
          onChange={(e) => onChangeText?.(e.target.value)}
          placeholder={placeholder}
          readOnly={!editable || Boolean(onPressField)}
          onClick={onPressField}
          {...inputProps}
        />
        {trailing}
        {rightIcon ? (
          <Icon name={rightIcon === 'calendar' ? 'calendar' : 'chevron-down'} size={20} color="#FFD700" />
        ) : null}
      </span>
      <span className="auth-underline" />
    </label>
  );
}
