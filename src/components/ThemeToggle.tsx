import { useTheme } from '../context/ThemeContext';
import type { ThemePreference } from '../theme/themePreference';

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
      role="group"
      aria-label="Color theme"
    >
      {OPTIONS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          className={
            preference === value
              ? 'theme-toggle-segment active'
              : 'theme-toggle-segment'
          }
          aria-pressed={preference === value}
          onClick={() => setPreference(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
