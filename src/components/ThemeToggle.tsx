import { useTheme } from '../theme/ThemeProvider';
import type { ThemePreference } from '../theme/theme';

const OPTIONS: { value: ThemePreference; label: string; title: string }[] = [
  { value: 'system', label: 'System', title: 'Match system appearance' },
  { value: 'light', label: 'Light', title: 'Light mode' },
  { value: 'dark', label: 'Dark', title: 'Dark mode' },
];

export function ThemeToggle() {
  const { preference, setPreference } = useTheme();

  return (
    <div className="theme-toggle" role="group" aria-label="Color theme">
      {OPTIONS.map(({ value, label, title }) => (
        <button
          key={value}
          type="button"
          className={
            preference === value
              ? 'theme-toggle-btn active'
              : 'theme-toggle-btn'
          }
          aria-pressed={preference === value}
          title={title}
          onClick={() => setPreference(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
