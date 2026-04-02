import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useThemeContext, type ThemePreference } from '../context/ThemeContext';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const { preference, setPreference } = useThemeContext();

  const themeOptions: Array<{ label: string; value: ThemePreference }> = [
    { label: 'System', value: 'system' },
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
  ];

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
          <div
            className="theme-toggle"
            role="group"
            aria-label="Theme preference"
          >
            {themeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={
                  preference === option.value
                    ? 'theme-toggle-btn active'
                    : 'theme-toggle-btn'
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
