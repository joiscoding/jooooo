import { useTheme } from '../context/ThemeContext';
import type { ThemePreference } from '../theme/theme';

const OPTIONS: { value: ThemePreference; label: string; title: string }[] = [
  { value: 'system', label: 'System', title: 'Use system theme' },
  { value: 'light', label: 'Light', title: 'Light theme' },
  { value: 'dark', label: 'Dark', title: 'Dark theme' },
];

export function ThemeToggle() {
  const { preference, setPreference } = useTheme();

  return (
    <div
      className="theme-toggle"
      role="group"
      aria-label="Color theme"
    >
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={
            preference === option.value
              ? 'theme-toggle-btn active'
              : 'theme-toggle-btn'
          }
          aria-pressed={preference === option.value}
          title={option.title}
          onClick={() => setPreference(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
