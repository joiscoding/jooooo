import { useTheme } from '../theme/ThemeContext';

const labels: Record<string, string> = {
  system: 'Match system',
  light: 'Light',
  dark: 'Dark',
};

export function ThemeToggle() {
  const { preference, cyclePreference, effectiveTheme } = useTheme();

  const title =
    preference === 'system'
      ? `Theme: System (${effectiveTheme === 'dark' ? 'dark' : 'light'}). Click to switch.`
      : `Theme: ${labels[preference] ?? preference}. Click to cycle System → Light → Dark.`;

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={cyclePreference}
      aria-label={title}
      title={title}
    >
      <span className="theme-toggle-icon" aria-hidden>
        {preference === 'system' && (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
            <circle
              cx="12"
              cy="12"
              r="4"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
            />
          </svg>
        )}
        {preference === 'light' && (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
            <circle cx="12" cy="12" r="5" fill="currentColor" />
            <path
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
            />
          </svg>
        )}
        {preference === 'dark' && (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M21 14.5A7.5 7.5 0 0 1 9.5 3 7.5 7.5 0 1 0 21 14.5z" />
          </svg>
        )}
      </span>
      <span className="theme-toggle-label">{labels[preference] ?? preference}</span>
    </button>
  );
}
