import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import { isFocusSearchShortcut } from '../lib/isFocusSearchShortcut';

function useShortcutHint(): string {
  const [hint, setHint] = useState('Ctrl+K');

  useEffect(() => {
    const ua = navigator.userAgent;
    const platform = navigator.platform;
    const apple =
      /Mac|iPhone|iPad|iPod/i.test(platform) || ua.includes('Mac OS');
    setHint(apple ? '⌘K' : 'Ctrl+K');
  }, []);

  return hint;
}

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const { query, setQuery, searchInputRef, focusSearch } = useSearch();
  const shortcutHint = useShortcutHint();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!isFocusSearchShortcut(e)) return;
      e.preventDefault();
      focusSearch();
    };
    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [focusSearch]);

  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-serif">Studio</span>
          <span className="logo-sans">Lookbook</span>
        </Link>

        <div className="header-search">
          <label htmlFor="global-search" className="visually-hidden">
            Search looks
          </label>
          <div className="header-search-field">
            <input
              ref={searchInputRef}
              id="global-search"
              type="search"
              name="q"
              className="header-search-input"
              placeholder="Search looks…"
              autoComplete="off"
              spellCheck={false}
              value={query}
              onChange={(ev) => setQuery(ev.target.value)}
              aria-describedby="global-search-shortcut-hint"
            />
            <span
              id="global-search-shortcut-hint"
              className="header-search-kbd"
              aria-hidden
            >
              {shortcutHint}
            </span>
          </div>
        </div>

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
