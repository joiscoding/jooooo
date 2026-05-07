import { useTheme } from '../context/ThemeContext';
import type { ThemePreference } from '../theme';

const OPTIONS: {
  value: ThemePreference;
  label: string;
  title: string;
}[] = [
  { value: 'system', label: 'System', title: 'Match system appearance' },
  { value: 'light', label: 'Light', title: 'Light theme' },
  { value: 'dark', label: 'Dark', title: 'Dark theme' },
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
            'theme-toggle-btn' + (preference === value ? ' active' : '')
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
