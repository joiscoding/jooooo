import { useTheme } from '../context/ThemeContext';
import type { ThemePreference } from '../theme/theme';

const OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export function ThemeToggle() {
  const { preference, setPreference } = useTheme();

  return (
    <div
      className="theme-toggle"
      role="radiogroup"
      aria-label="Color theme"
    >
      {OPTIONS.map(({ value, label }) => {
        const selected = preference === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={selected}
            className={selected ? 'theme-toggle-btn active' : 'theme-toggle-btn'}
            onClick={() => setPreference(value)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
