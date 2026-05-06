import { useTheme } from '../theme/ThemeContext';
import type { ThemePreference } from '../theme/types';

const OPTIONS: { value: ThemePreference; label: string; title: string }[] = [
  { value: 'system', label: 'Auto', title: 'Match system appearance' },
  { value: 'light', label: 'Light', title: 'Light appearance' },
  { value: 'dark', label: 'Dark', title: 'Dark appearance' },
];

export function ThemeToggle() {
  const { preference, setPreference } = useTheme();

  return (
    <div
      className="theme-toggle"
      role="group"
      aria-label="Color scheme"
    >
      {OPTIONS.map(({ value, label, title }) => (
        <button
          key={value}
          type="button"
          className={
            preference === value ? 'theme-toggle-btn active' : 'theme-toggle-btn'
          }
          title={title}
          aria-pressed={preference === value}
          onClick={() => setPreference(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
