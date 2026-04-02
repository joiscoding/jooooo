import { Link, useLocation } from 'react-router-dom';
import { useThemeContext, type ThemePreference } from '../context/ThemeContext';
import type { ReactNode } from 'react';

const THEME_OPTIONS: Array<{ value: ThemePreference; label: string }> = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { preference, setPreference } = useThemeContext();
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-serif">Studio</span>
          <span className="logo-sans">Lookbook</span>
        </Link>
        <div className="header-actions">
          <nav className="nav">
            <Link
              to="/"
              className={pathname === '/' ? 'nav-link active' : 'nav-link'}
            >
              Gallery
            </Link>
            <Link
              to="/albums"
              className={isAlbums ? 'nav-link active' : 'nav-link'}
            >
              Albums
            </Link>
          </nav>

          <div className="theme-control" role="group" aria-label="Theme">
            {THEME_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={
                  preference === option.value
                    ? 'theme-option active'
                    : 'theme-option'
                }
                onClick={() => setPreference(option.value)}
                aria-pressed={preference === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </header>
      <main className="main">{children}</main>
      <footer className="site-footer">
        <p>
          Demo — photos via{' '}
          <a
            href="https://unsplash.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Unsplash
          </a>
          . Modern style, designed to last.
        </p>
      </footer>
    </div>
  );
}
