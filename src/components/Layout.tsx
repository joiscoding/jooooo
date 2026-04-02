import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useThemeContext } from '../context/ThemeContext';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const { preference, setPreference } = useThemeContext();

  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-serif">Studio</span>
          <span className="logo-sans">Lookbook</span>
        </Link>
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
        <fieldset className="theme-toggle" aria-label="Theme preference">
          <legend className="sr-only">Theme preference</legend>
          <label className="theme-option">
            <input
              type="radio"
              name="theme-preference"
              value="system"
              checked={preference === 'system'}
              onChange={() => setPreference('system')}
            />
            <span>System</span>
          </label>
          <label className="theme-option">
            <input
              type="radio"
              name="theme-preference"
              value="light"
              checked={preference === 'light'}
              onChange={() => setPreference('light')}
            />
            <span>Light</span>
          </label>
          <label className="theme-option">
            <input
              type="radio"
              name="theme-preference"
              value="dark"
              checked={preference === 'dark'}
              onChange={() => setPreference('dark')}
            />
            <span>Dark</span>
          </label>
        </fieldset>
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
