import { useId } from 'react';
import type { ThemePreference } from '../theme';

const OPTIONS: { value: ThemePreference; label: string; title: string }[] = [
  { value: 'system', label: 'System', title: 'Use system appearance' },
  { value: 'light', label: 'Light', title: 'Light mode' },
  { value: 'dark', label: 'Dark', title: 'Dark mode' },
];

type Props = {
  preference: ThemePreference;
  onChange: (next: ThemePreference) => void;
};

export function ThemeToggle({ preference, onChange }: Props) {
  const id = useId();
  const radioName = `lookbook-theme-pref-${id}`.replace(/:/g, '');
  return (
    <div
      className="theme-toggle"
      role="group"
      aria-label="Color theme"
    >
      {OPTIONS.map((opt) => {
        const inputId = `lookbook-theme-${id}-${opt.value}`.replace(/:/g, '');
        return (
          <div key={opt.value} className="theme-toggle-option">
            <input
              className="theme-toggle-input"
              type="radio"
              name={radioName}
              id={inputId}
              value={opt.value}
              checked={preference === opt.value}
              onChange={() => onChange(opt.value)}
              title={opt.title}
            />
            <label
              className="theme-toggle-label"
              htmlFor={inputId}
            >
              {opt.label}
            </label>
          </div>
        );
      })}
    </div>
  );
}
