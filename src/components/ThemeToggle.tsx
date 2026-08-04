import { useTheme } from '../theme/ThemeProvider';
import { nextExplicitTheme } from '../theme/theme';

function SunIcon() {
  return (
    <svg
      className="theme-toggle-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M12 3v2.2M12 18.8V21M4.93 4.93l1.56 1.56M17.51 17.51l1.56 1.56M3 12h2.2M18.8 12H21M4.93 19.07l1.56-1.56M17.51 6.49l1.56-1.56"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      className="theme-toggle-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M16.8 14.35A6.8 6.8 0 0 1 9.65 7.2 6.85 6.85 0 1 0 16.8 14.35Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ThemeToggle() {
  const { resolved, setPreference } = useTheme();
  const next = nextExplicitTheme(resolved);
  const label = next === 'dark' ? 'Switch to dark mode' : 'Switch to light mode';

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={label}
      title={label}
      onClick={() => setPreference(next)}
    >
      {resolved === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
