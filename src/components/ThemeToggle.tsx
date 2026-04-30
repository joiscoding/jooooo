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
    <div className="theme-toggle" role="group" aria-label="Color theme">
      {OPTIONS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          className={`theme-toggle-btn${preference === value ? ' active' : ''}`}
          onClick={() => setPreference(value)}
          aria-pressed={preference === value}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
